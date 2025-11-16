import { Transform as TransformClass } from 'stream';
import { pipeline } from 'stream/promises';

const transform = async () => {

    const myTransform = new TransformClass({
        transform(chunk, encoding, callback) {
            chunk = chunk.toString().split('').reverse().join('');

            callback(null, chunk);
        }
    });

    await pipeline(
        process.stdin,
        myTransform,
        process.stdout
    );
};

await transform();
