import { writeFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const create = async () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const filePath = join(__dirname, 'files', 'fresh.txt');
    let fileExists = true;
    const defaultErrorMsg = 'FS operation failed';


    try {
        await access(filePath);
    } catch (err) {
        fileExists = false;
    }

    if (fileExists) {
        throw new Error(defaultErrorMsg);
    }

    try {
        await writeFile(filePath, 'I am fresh and young', 'utf-8');
    } catch {
        throw new Error(defaultErrorMsg);
    }
};

await create();
