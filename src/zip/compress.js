import {createGzip} from 'zlib';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { access } from "fs/promises";
import { FS_OPERATION_FAILED } from '../fs/constants.js';

const compress = async () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const srcFilePath = join(__dirname, 'files', 'fileToCompress.txt');
    const destFilePath = join(__dirname, 'files', 'archive.gz');

    const srcFileExists = await access(srcFilePath).then(() => true).catch(() => false);

    if (!srcFileExists) {
        throw new Error(FS_OPERATION_FAILED);
    }

    await pipeline(
        createReadStream(srcFilePath),
        createGzip(),
        createWriteStream(destFilePath)
    );
};

await compress();
