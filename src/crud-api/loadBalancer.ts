import http, { IncomingMessage, ServerResponse } from 'http';
import { config } from './config/env';
import os from 'os';

const numWorkers = os.availableParallelism() - 1 || 1;
let currentWorker = 0;

// List of worker ports
const workerPorts = Array.from(
    { length: numWorkers },
    (_, i) => config.port + i + 1
);

export function createLoadBalancer() {
    return http.createServer((req: IncomingMessage, res: ServerResponse) => {
        // Round-robin: select next worker
        const targetPort = workerPorts[currentWorker];
        currentWorker = (currentWorker + 1) % numWorkers;

        console.log(`[Load Balancer] Forwarding ${req.method} ${req.url} to Worker on port ${targetPort}`);

        // Proxy request to worker
        const options = {
            hostname: 'localhost',
            port: targetPort,
            path: req.url,
            method: req.method,
            headers: req.headers,
        };

        const proxyReq = http.request(options, (proxyRes) => {
            // Copy status and headers from worker
            res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);

            // Forward response body
            proxyRes.pipe(res);
        });

        // Error handling
        proxyReq.on('error', (error) => {
            console.error(`[Load Balancer] Error forwarding to port ${targetPort}:`, error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Load balancer error' }));
        });

        // Forward request body
        req.pipe(proxyReq);
    });
}
