export interface User {
    id: string; // UUID v4
    username: string;
    age: number;
    hobbies: string[];
    email?: string;
}