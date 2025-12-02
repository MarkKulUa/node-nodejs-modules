import cluster, { Worker } from 'cluster';
import os from 'os';
import { config } from './config/env';
import { createLoadBalancer } from './loadBalancer';

const numWorkers = os.availableParallelism() - 1 || 1;

if (cluster.isPrimary) {
    console.log(`Master process ${process.pid} is running`);
    console.log(`Starting ${numWorkers} workers...`);

    const workers: Worker[] = [];

    // Create workers
    for (let i = 0; i < numWorkers; i++) {
        const worker = cluster.fork({
            WORKER_PORT: String(config.port + i + 1),
            WORKER_ID: String(i + 1)
        });

        workers.push(worker);

        // Listen for DB sync messages from workers
        worker.on('message', (msg) => {
            // Broadcast to all OTHER workers
            workers.forEach(w => {
                if (w.id !== worker.id) {
                    w.send(msg);
                }
            });
        });
    }

    // Start Load Balancer
    const loadBalancer = createLoadBalancer();
    loadBalancer.listen(config.port, () => {
        console.log(`\n🚀 Load Balancer listening on http://localhost:${config.port}`);
        console.log(`📊 Distributing requests across ${numWorkers} workers\n`);
    });

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });

} else {
    // Worker process
    await import('./worker.js');
}
