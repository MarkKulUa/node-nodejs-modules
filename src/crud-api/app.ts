import http, { IncomingMessage, ServerResponse } from 'http';
import { UserController } from './controllers/userController';
import { handleServerError, handle404 } from './utils/errorHandler';

export function createApp() {
    return http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const { method, url } = req;
            const urlParts = url?.split('?')[0]?.split('/').filter(Boolean);

            // GET /api/users
            if (method === 'GET' && url === '/api/users') {
                return UserController.getAllUsers(req, res);
            }

            // GET /api/users/{userId}
            if (method === 'GET' && urlParts?.[0] === 'api' && urlParts?.[1] === 'users' && urlParts?.[2]) {
                const userId = urlParts[2];
                return UserController.getUserById(req, res, userId);
            }

            // POST /api/users
            if (method === 'POST' && url === '/api/users') {
                return await UserController.createUser(req, res);
            }

            // PUT /api/users/{userId}
            if (method === 'PUT' && urlParts?.[0] === 'api' && urlParts?.[1] === 'users' && urlParts?.[2]) {
                const userId = urlParts[2];
                return await UserController.updateUser(req, res, userId);
            }

            // DELETE /api/users/{userId}
            if (method === 'DELETE' && urlParts?.[0] === 'api' && urlParts?.[1] === 'users' && urlParts?.[2]) {
                const userId = urlParts[2];
                return UserController.deleteUser(req, res, userId);
            }

            handle404(res);
        } catch (error) {
            handleServerError(res, error);
        }
    });
}
