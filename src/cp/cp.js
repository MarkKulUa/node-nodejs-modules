import { spawn } from 'child_process'
import {dirname, join} from "path";
import {fileURLToPath} from "url";

const scriptPath = join(dirname(fileURLToPath(import.meta.url)), 'files', 'script.js');

const spawnChildProcess = async (args) => {

  const childProcess = spawn('node', [scriptPath, ...args], {
      stdio: [process.stdin, process.stdout, 'inherit']
  });

};

spawnChildProcess(['someArgument1', 'someArgument2', '...']);
