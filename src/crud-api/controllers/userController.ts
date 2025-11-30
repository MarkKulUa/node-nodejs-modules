import { IncomingMessage, ServerResponse } from 'http';
import { db } from '../database/inMemoryDb';
import {isValidAge, isValidHobbies, isValidUserName, isValidUUID, parseBody} from '../utils/validation';

export class UserController {

    // GET /api/users
    static getAllUsers(req: IncomingMessage, res: ServerResponse) {
        const users = db.getAllUsers();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }

    // GET /api/users/{userId}
    static getUserById(req: IncomingMessage, res: ServerResponse, userId: string) {

        if (!isValidUUID(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Invalid user ID" }));
        }

        const user = db.getUserById(userId);

        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "User not found" }));
        }

        // Успех
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    }

    // POST /api/users
    static async createUser(req: IncomingMessage, res: ServerResponse) {

        try {
            const reqData = await parseBody(req);

            if (!isValidUserName(reqData.username) || !isValidAge(reqData.age) || !isValidHobbies(reqData.hobbies)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Required fields missing" }));
            }

            const newUser = db.createUser({
                username: reqData.username,
                age: reqData.age,
                hobbies: reqData.hobbies
            });

            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(newUser));

        } catch (e) {
            console.error('Error in createUser:', e);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid JSON" }));
        }
    }

    // PUT /api/users/{userId}
    static async updateUser(req: IncomingMessage, res: ServerResponse, userId: string) {

        try {
            if(!isValidUUID(userId)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "userId not valid" }));
            }

            const reqData = await parseBody(req);

            if (!isValidUserName(reqData.username) || !isValidAge(reqData.age) || !isValidHobbies(reqData.hobbies)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Required fields missing" }));
            }

            const user = db.updateUser(userId, reqData);

            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "User not found" }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(user));

        } catch (e) {
            console.error('Error in updateUser:', e);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid JSON" }));
        }
    }

    // DELETE /api/users/{userId}
    static deleteUser(req: IncomingMessage, res: ServerResponse, userId: string) {

        if (!isValidUUID(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Invalid user ID" }));
        }

        const deleted = db.deleteUser(userId);

        if (!deleted) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "User not found" }));
        }

        res.writeHead(204);
        res.end();
    }
}
