import { Worker } from "worker_threads";
import os from "os";
import { dirname, join } from "path";
import { fileURLToPath} from "url";

const workerPath = join(dirname(fileURLToPath(import.meta.url)), 'worker.js');

const createWorkerPromise = (workerData) => {
    return new Promise((resolve, reject) => {

        const worker = new Worker(workerPath);

        worker.on('message', (result) => {
            resolve(result);
            worker.terminate();
        });

        worker.on('error', (error) => {
            reject(error);
        });

        worker.postMessage(workerData);
    });
};

const performCalculations = async () => {

    const cpuCount = os.cpus().length;

    let promises = [];
    for(let i = 0; i < cpuCount ; i++ ) {
        const n = 10 + i;
        promises.push(createWorkerPromise(n))
    }

    const workerResults = await Promise.allSettled(promises);

    const res = workerResults.map(result => {

        if(result?.status === 'fulfilled') {
            return {status: 'resolved', data: result.value}
        }

        return {status: 'error', data: null};
    });

    console.log('res',res);
};

await performCalculations();
