import { writeFile, access } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const create = async () => {
    const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));
    const filePath = join(__dirname, 'files', 'fresh.txt');
    let fileExists = true;

    try {
        await access(filePath);
    } catch (err) {
        fileExists = false;
    }

    if (fileExists) {
        throw new Error('FS operation failed. File exists');
    }

    try {
        await writeFile(filePath, 'I am fresh and young', 'utf-8');
    } catch {
        throw new Error('FS operation failed');
    }
};

await create();
