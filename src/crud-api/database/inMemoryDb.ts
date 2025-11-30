import { User } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

class InMemoryDatabase {
    private users: User[] = [];

    getAllUsers(): User[] {
        return this.users;
    }

    getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    createUser(userData: Omit<User, 'id'>): User {
        const user: User = { id: uuidv4(), ...userData };
        this.users.push(user);
        return user;
    }

    updateUser(id: string, userData: Omit<User, 'id'>): User | undefined {
        const index = this.users.findIndex(user => user.id === id);

        if (index === -1) {
            return undefined;
        }

        const updatedUser = { ...userData, id };
        this.users.splice(index, 1, updatedUser);
        return updatedUser;
    }

    deleteUser(id: string): boolean {
        const index = this.users.findIndex(user => user.id === id);

        if (index === -1) {
            return false;
        }

        this.users.splice(index, 1);
        return true;
    }
}

export const db = new InMemoryDatabase();
