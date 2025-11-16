import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import {dirname, join} from "path";
import {fileURLToPath} from "url";

const calculateHash = async () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const srcFilePath = join(__dirname, 'files', 'fileToCalculateHashFor.txt');

    //V1
    const hash = createHash('sha256');
    const fileStream = createReadStream(srcFilePath);
    fileStream.on('data', (chunk) => hash.update(chunk));
    fileStream.on('end', () => console.log(hash.digest('hex')));
    fileStream.on('error', (err) => console.error('Error reading file:', err));

    //V2
    const hash2 = createHash('sha256');
    const fileStream2 = createReadStream(srcFilePath);
    fileStream2.pipe(hash2).on('finish', () => console.log(hash2.digest('hex')));
};

await calculateHash();
