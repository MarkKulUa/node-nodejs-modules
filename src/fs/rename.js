import { access, rename as fsRename } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const rename = async () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const srcFilePath = join(__dirname, 'files', 'wrongFilename.txt');
    const destFilePath = join(__dirname, 'files', 'properFilename.md');
    const defaultErrorMsg = 'FS operation failed';

    const destFileExists = await access(destFilePath).then(() => true).catch(() => false);

    if (destFileExists) {
        throw new Error(defaultErrorMsg);
    }

    try {
        await access(srcFilePath);
    } catch (err) {
        throw new Error(defaultErrorMsg);
    }

    try {
        await fsRename(srcFilePath, destFilePath);
    } catch {
        throw new Error(defaultErrorMsg);
    }
}

await rename();
