import { config } from './config/env';
import { createApp } from './app';

const server = createApp();

server.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
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
