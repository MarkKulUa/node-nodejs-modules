import { access, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from "url";
import { FS_OPERATION_FAILED } from "./constants.js";

const list = async () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const srcFilePath = join(__dirname, 'files');

    const srcFolderExists = await access(srcFilePath).then(() => true).catch(() => false);

    if (!srcFolderExists) {
        throw new Error(FS_OPERATION_FAILED);
    }

    try {
        const entries = await readdir(srcFilePath, { withFileTypes: true });

        const files = entries
            .filter(entry => entry.isFile())
            .map(entry => entry.name);

        console.log(files);

    } catch {
        throw new Error(FS_OPERATION_FAILED);
    }
};

await list();
