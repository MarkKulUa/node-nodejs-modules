import { createWriteStream } from 'fs';
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const write = () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const srcFilePath = join(__dirname, 'files', 'fileToWrite.txt');

    // V1
    const stream = createWriteStream(srcFilePath, 'utf-8');
    process.stdin.on('data', (chunk) => stream.write(chunk));
    process.stdin.on('end', () => stream.end());
    stream.on('error', (err) => console.error('Error:', err));

    // V2
    // const stream2 = createWriteStream(srcFilePath, 'utf-8');
    // process.stdin.pipe(stream2);
};

await write();
