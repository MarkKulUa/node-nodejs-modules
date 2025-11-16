import { createReadStream } from 'fs';
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const read = () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const srcFilePath = join(__dirname, 'files', 'fileToRead.txt');

    // V1
    const stream = createReadStream(srcFilePath, 'utf-8');
    stream.on('data', (chunk) => process.stdout.write(chunk));
    stream.on('error', (err) => console.error('Error:', err));
    stream.on('end', () => process.stdout.write('\n'));

    // V2
    const stream2 = createReadStream(srcFilePath, 'utf-8');
    stream2.pipe(process.stdout);
    stream2.on('end', () => process.stdout.write('\n'));
};

read();
