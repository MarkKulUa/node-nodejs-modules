import { access, rm } from 'fs/promises';
import { join, dirname } from 'path';
import {fileURLToPath} from "url";
import { FS_OPERATION_FAILED } from './constants.js';

const remove = async () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const srcFilePath = join(__dirname, 'files', 'fileToRemove.txt');

    const srcFileExists = await access(srcFilePath).then(() => true).catch(() => false);

    if (!srcFileExists) {
        throw new Error(FS_OPERATION_FAILED);
    }

    try {
        await rm(srcFilePath);
    } catch {
        throw new Error(FS_OPERATION_FAILED);
    }
}

await remove();
