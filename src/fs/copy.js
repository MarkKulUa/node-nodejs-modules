import {cp, lstat} from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const copy = async () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const srcFilePath = join(__dirname, 'files');
    const destFilePath = join(__dirname, 'files_copy');
    const defaultErrorMsg = 'FS operation failed';

    const srcFolderExists = await lstat(srcFilePath).then(() => true).catch(() => false);
    const destFolderExists = await lstat(destFilePath).then(() => true).catch(() => false);

    if (!srcFolderExists) {
        throw new Error(defaultErrorMsg);
    }

    if (destFolderExists) {
        throw new Error(defaultErrorMsg);
    }

    try {
        await cp(srcFilePath, destFilePath, { recursive: true });
    } catch {
        throw new Error(defaultErrorMsg);
    }
};

await copy();
