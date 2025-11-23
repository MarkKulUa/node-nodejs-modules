import { argv, stdin, stdout, exit } from 'process';
import readline from 'readline';
import os from 'os';
import path from 'path';
import { access, readdir, rename as fsRename, stat, writeFile, unlink } from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { createBrotliCompress, createBrotliDecompress} from "zlib";
import {createHash} from "crypto";

let currentDir = os.homedir();

const getUsernameFromArgs = () => {
  const args = argv.slice(2);

  const usernameArg = args.find(arg => arg.startsWith('--username='));
  return usernameArg ? usernameArg.split('=')[1] : 'Anonymous';
};

const username = getUsernameFromArgs();

const printCurrentDir = () => {
  console.log(`You are currently in ${currentDir}`);
};

const welcome = () => {
  console.log(`Welcome to the File Manager, ${username}!`);
  printCurrentDir();
};

const goodbye = () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  exit(0);
};

// ============ NAVIGATION ============
const handleUp = () => {
    const parentDir = path.dirname(currentDir);

    if (parentDir === 'root') {
        return;
    }

    currentDir = parentDir;
};

const handleCd = async (targetPath) => {
    const absolutePath = path.resolve(currentDir, targetPath);

    const stats = await stat(absolutePath);

    if (!stats.isDirectory()) {
        throw new Error('Operation failed');
    }

    currentDir = absolutePath;
};

const handleLs = async () => {

    const entries = await readdir(currentDir, { withFileTypes: true });

    const folders = entries.filter(entry => entry.isDirectory());
    const files = entries.filter(entry => entry.isFile());

    folders.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    const sorted = [...folders, ...files];

    console.table(sorted.map(entry => ({
        Name: entry.name,
        Type: entry.isDirectory() ? 'directory' : 'file'
    })));
};

// ============ FILE OPERATIONS ============
const handleCat = async (filePath, limit = 100) => {
    const absolutePath = path.resolve(currentDir, filePath);
    const stats = await stat(absolutePath);

    if (!stats.isFile()) {
        throw new Error('Operation failed');
    }

    if (limit) {
        const stream = createReadStream(absolutePath, { end: limit - 1 });
        await pipeline(stream, process.stdout);
        console.log('\n... (truncated)');
    } else {
        await pipeline(
            createReadStream(absolutePath),
            process.stdout
        );
    }
};

const handleAdd = async (fileName) => {

    const filePath = path.resolve(currentDir, fileName);
    let fileExists = true;

    try {
        await access(filePath);
    } catch (err) {
        fileExists = false;
    }

    if (fileExists) {
        throw new Error('Operation failed. File exists');
    }

    await writeFile(filePath, '');
};

const handleRn = async (oldPath, newName) => {

    const srcFilePath = path.resolve(currentDir, oldPath);
    const destFilePath = path.resolve(currentDir, newName);
    const srcFileExists = await access(srcFilePath).then(() => true).catch(() => false);
    const destFileExists = await access(destFilePath).then(() => true).catch(() => false);

    if (!srcFileExists) {
        throw new Error('Operation failed');
    }

    if (destFileExists) {
        throw new Error('Operation failed');
    }

    await fsRename(srcFilePath, destFilePath);
};

const handleCp = async (source, destination) => {

    const srcFilePath = path.resolve(currentDir, source);
    let destFilePath = path.resolve(currentDir, destination);

    const srcFileExists = await access(srcFilePath).then(() => true).catch(() => false);

    if (!srcFileExists) {
        throw new Error('Operation failed');
    }

    try {
        const destStats = await stat(destFilePath);
        if (destStats.isDirectory()) {
            // If directory, adding filename
            const fileName = path.basename(srcFilePath);
            destFilePath = path.join(destFilePath, fileName);
        }
    } catch (err) {}

    const destFileExists = await access(destFilePath).then(() => true).catch(() => false);
    if (destFileExists) {
        throw new Error('Operation failed');
    }

    await pipeline(
        createReadStream(srcFilePath),
        createWriteStream(destFilePath)
    );
};

const handleMv = async (source, destination) => {
    const srcFilePath = path.resolve(currentDir, source);

    await handleCp(source, destination);
    await unlink(srcFilePath);
};

const handleRm = async (filePath) => {
    const srcFilePath = path.resolve(currentDir, filePath);

    await unlink(srcFilePath);
};

// ============ OS INFO ============
const handleOs = (flag) => {
    switch (flag) {
        case '--EOL':
            console.log(JSON.stringify(os.EOL));
            break;
        case '--cpus':
            const cpus = os.cpus();
            console.log(`Total CPUs: ${cpus.length}`);
            cpus.forEach((cpu, index) => {
                console.log(`CPU ${index + 1}: ${cpu.model}, ${(cpu.speed / 1000).toFixed(2)} GHz`);
            });
            break;
        case '--homedir':
            console.log(os.homedir());
            break;
        case '--username':
            console.log(os.userInfo().username);
            break;
        case '--architecture':
            console.log(os.arch());
            break;
        default:
            throw new Error('Invalid input');
    }
};

// ============ HASH ============
const handleHash = async (filePath) => {
    const srcFilePath = path.resolve(currentDir, filePath);
    const hash = createHash('sha256');

    await pipeline(
        createReadStream(srcFilePath),
        hash
    );

    console.log(hash.digest('hex'));
};

// ============ COMPRESS/DECOMPRESS ============
const handleCompress = async (source, destination) => {

    const srcFilePath = path.resolve(currentDir, source);
    const destFilePath = path.resolve(currentDir, destination);
    const srcFileExists = await access(srcFilePath).then(() => true).catch(() => false);
    const destFileExists = await access(destFilePath).then(() => true).catch(() => false);

    if (!srcFileExists) {
        throw new Error('Operation failed');
    }

    if (destFileExists) {
        throw new Error('Operation failed');
    }

    await pipeline(
        createReadStream(srcFilePath),
        createBrotliCompress(),
        createWriteStream(destFilePath)
    );
};

const handleDecompress = async (source, destination) => {

    const srcFilePath = path.resolve(currentDir, source);
    const destFilePath = path.resolve(currentDir, destination);
    const srcFileExists = await access(srcFilePath).then(() => true).catch(() => false);
    const destFileExists = await access(destFilePath).then(() => true).catch(() => false);

    if (!srcFileExists) {
        throw new Error('Operation failed');
    }

    if (destFileExists) {
        throw new Error('Operation failed');
    }

    await pipeline(
        createReadStream(srcFilePath),
        createBrotliDecompress(),
        createWriteStream(destFilePath)
    );
};

// ============ COMMAND PARSER ============
const parseCommand = async (input) => {
  const trimmed = input.trim();
  
  if (!trimmed) return;
  
  if (trimmed === '.exit') {
    goodbye();
    return;
  }
  
  const parts = trimmed.split(' ');
  const command = parts[0];
  
  try {
    switch (command) {
      case 'up':
        handleUp();
        break;
      case 'cd':
        if (parts.length < 2) throw new Error('Invalid input');
        await handleCd(parts[1]);
        break;
      case 'ls':
        await handleLs();
        break;
      case 'cat':
        if (parts.length < 2) throw new Error('Invalid input');
        await handleCat(parts[1]);
        break;
      case 'add':
        if (parts.length < 2) throw new Error('Invalid input');
        await handleAdd(parts[1]);
        break;
      case 'rn':
        if (parts.length < 3) throw new Error('Invalid input');
        await handleRn(parts[1], parts[2]);
        break;
      case 'cp':
        if (parts.length < 3) throw new Error('Invalid input');
        await handleCp(parts[1], parts[2]);
        break;
      case 'mv':
        if (parts.length < 3) throw new Error('Invalid input');
        await handleMv(parts[1], parts[2]);
        break;
      case 'rm':
        if (parts.length < 2) throw new Error('Invalid input');
        await handleRm(parts[1]);
        break;
      case 'os':
        if (parts.length < 2) throw new Error('Invalid input');
        handleOs(parts[1]);
        break;
      case 'hash':
        if (parts.length < 2) throw new Error('Invalid input');
        await handleHash(parts[1]);
        break;
      case 'compress':
        if (parts.length < 3) throw new Error('Invalid input');
        await handleCompress(parts[1], parts[2]);
        break;
      case 'decompress':
        if (parts.length < 3) throw new Error('Invalid input');
        await handleDecompress(parts[1], parts[2]);
        break;
      default:
        throw new Error('Invalid input');
    }
  } catch (error) {
    if (error.message === 'Invalid input') {
      console.log('Invalid input');
    } else {
      console.log('Operation failed');
    }
  }
  
  printCurrentDir();
};

// ============ MAIN ============
const startFileManager = () => {
  welcome();
  
  const rl = readline.createInterface({
    input: stdin,
    output: stdout
  });
  
  rl.on('line', parseCommand);
  
  rl.on('close', goodbye);
  
  // Ctrl+C
  process.on('SIGINT', goodbye);
};

startFileManager();
