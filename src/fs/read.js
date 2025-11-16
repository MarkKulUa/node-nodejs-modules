import { access, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import {fileURLToPath} from "url";
import { FS_OPERATION_FAILED } from './constants.js';

const read = async () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const srcFilePath = join(__dirname, 'files', 'fileToRead.txt');

    const srcFileExists = await access(srcFilePath).then(() => true).catch(() => false);

    if (!srcFileExists) {
        throw new Error(FS_OPERATION_FAILED);
    }

    try {
        const content = await readFile(srcFilePath, 'utf-8');
        console.log(content);
    } catch {
        throw new Error(FS_OPERATION_FAILED);
    }
};

await read();
