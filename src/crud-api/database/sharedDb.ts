import { User } from '../types/user';
import { v4 as uuidv4 } from 'uuid';
import cluster from 'cluster';

type DBAction =
    | { type: 'CREATE'; user: User }
    | { type: 'UPDATE'; id: string; user: Omit<User, 'id'> }
    | { type: 'DELETE'; id: string }
    | { type: 'SYNC'; users: User[] };

class SharedDatabase {
    private users: User[] = [];

    constructor() {
        // Listen for messages from master
        if (cluster.isWorker) {
            process.on('message', (msg: DBAction) => {
                this.handleMessage(msg);
            });
        }
    }

    private handleMessage(msg: DBAction) {
        switch (msg.type) {
            case 'CREATE':
                // Add user if not exists
                if (!this.users.find(u => u.id === msg.user.id)) {
                    this.users.push(msg.user);
                }
                break;
            case 'UPDATE':
                const updateIndex = this.users.findIndex(u => u.id === msg.id);
                if (updateIndex !== -1) {
                    this.users[updateIndex] = { ...msg.user, id: msg.id };
                }
                break;
            case 'DELETE':
                this.users = this.users.filter(u => u.id !== msg.id);
                break;
            case 'SYNC':
                this.users = msg.users;
                break;
        }
    }

    private broadcast(action: DBAction) {
        if (cluster.isWorker && process.send) {
            process.send(action);
        }
    }

    getAllUsers(): User[] {
        return this.users;
    }

    getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    createUser(userData: Omit<User, 'id'>): User {
        const user: User = { id: uuidv4(), ...userData };
        this.users.push(user);

        // Broadcast to other workers
        this.broadcast({ type: 'CREATE', user });

        return user;
    }

    updateUser(id: string, userData: Omit<User, 'id'>): User | undefined {
        const index = this.users.findIndex(user => user.id === id);

        if (index === -1) {
            return undefined;
        }

        const updatedUser = { ...userData, id };
        this.users.splice(index, 1, updatedUser);

        // Broadcast to other workers
        this.broadcast({ type: 'UPDATE', id, user: userData });

        return updatedUser;
    }

    deleteUser(id: string): boolean {
        const index = this.users.findIndex(user => user.id === id);

        if (index === -1) {
            return false;
        }

        this.users.splice(index, 1);

        // Broadcast to other workers
        this.broadcast({ type: 'DELETE', id });

        return true;
    }
}

export const db = new SharedDatabase();
