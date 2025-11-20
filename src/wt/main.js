import { Worker } from "worker_threads";
import os from "os";
import { dirname, join } from "path";
import { fileURLToPath} from "url";

// TASK:  implement function that creates number of worker threads (equal to the number of host machine logical CPU cores) from file worker.js and able to send data to those threads and to receive result of the computation from them. You should send incremental number starting from 10 to each worker. For example: on host machine with 4 cores you should create 4 workers and send 10 to first worker, 11 to second worker, 12 to third worker, 13 to fourth worker. After all workers will finish, function should log array of results into console. The results are array of objects with 2 properties:
// status - 'resolved' in case of successfully received value from worker or 'error' in case of error in worker
// data - value from worker in case of success or null in case of error in worker
// The results in the array must be in the same order that the workers were created

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
