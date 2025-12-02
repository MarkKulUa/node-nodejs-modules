import { config } from './config/env';
import { createApp } from './app';

const server = createApp();

const port = process.env.WORKER_PORT
    ? parseInt(process.env.WORKER_PORT)
    : config.port;

server.listen(port, () => {
    const workerId = process.env.WORKER_ID || 'main';
    console.log(`Server (worker ${workerId}) running on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
