import { createApp } from './app';

const server = createApp();

const port = process.env.WORKER_PORT
    ? parseInt(process.env.WORKER_PORT)
    : 4000;

const workerId = process.env.WORKER_ID || 'unknown';

server.listen(port, () => {
    console.log(`Worker ${workerId} (PID ${process.pid}) listening on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => {
        process.exit(0);
    });
});
