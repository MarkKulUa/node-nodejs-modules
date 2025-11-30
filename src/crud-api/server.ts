import http, { IncomingMessage, ServerResponse } from 'http';
import { config } from './config/env';
import { UserController } from './controllers/userController';

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;

    const urlParts = url?.split('?')[0]?.split('/').filter(Boolean);

    if (method === 'GET' && url === '/api/users') {
        return UserController.getAllUsers(req, res);
    }

    // GET /api/users/{userId}
    if (method === 'GET' && urlParts?.[0] === 'api' && urlParts?.[1] === 'users' && urlParts?.[2]) {
        const userId = urlParts[2];
        return UserController.getUserById(req, res, userId);
    }

    if (method === 'POST' && url === '/api/users') {
        return UserController.createUser(req, res);
    }

    if (method === 'PUT' && urlParts?.[0] === 'api' && urlParts?.[1] === 'users' && urlParts?.[2]) {
        const userId = urlParts[2];
        return UserController.updateUser(req, res, userId);
    }

    if (method === 'DELETE' && urlParts?.[0] === 'api' && urlParts?.[1] === 'users' && urlParts?.[2]) {
        const userId = urlParts[2];
        return UserController.deleteUser(req, res, userId);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
});

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