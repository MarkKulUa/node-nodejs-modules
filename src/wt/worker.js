import { parentPort } from 'worker_threads';

const nthFibonacci = (n) => n < 2 ? n : nthFibonacci(n - 1) + nthFibonacci(n - 2);

const sendResult = (res) => {
    parentPort.postMessage(res);
};

parentPort.on('message', (n) => {
    const result = nthFibonacci(n);
    sendResult(result);
});

// const sendResult = () => {
//     parentPort.on('message', (n) => {
//         const res = (typeof n === 'number' && n >= 0) ? nthFibonacci(n) : 0;
//         parentPort.postMessage(res);
//     })
// };
//
// sendResult();
