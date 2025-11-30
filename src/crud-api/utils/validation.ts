import {IncomingMessage} from "http";

export function isValidUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
}

export function isValidUserName(username: unknown): boolean {
    return typeof username === 'string' && username.length > 0 && username.length <= 255;
}

export function isValidAge(age: unknown): boolean {
    return typeof age === 'number' && age > 0 && age < 150 && Number.isInteger(age);
}

export function isValidHobbies(hobbies: unknown): boolean {
    if (!Array.isArray(hobbies)) return false;

    return hobbies.every(hobby => typeof hobby === 'string');
}

export function parseBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch (error) {
                reject(error);
            }
        });
    });
}
