import request from 'supertest';
import { createApp } from '../app';
import http from 'http';

describe('CRUD API - Full scenario', () => {
    let server: http.Server;
    let baseUrl: string;
    let createdUserId: string;

    beforeAll((done) => {
        server = createApp();
        server.listen(0, () => {
            const address = server.address() as any;
            baseUrl = `http://localhost:${address.port}`;
            done();
        });
    });

    afterAll((done) => {
        server.close(done);
    });

    // Test 1: GET all users
    it('should return empty array on GET /api/users', async () => {
        const response = await request(baseUrl).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    // Test 2: POST create user
    it('should create new user on POST /api/users', async () => {
        const newUser = {
            username: 'John Doe',
            age: 30,
            hobbies: ['coding', 'gaming']
        };

        const response = await request(baseUrl)
            .post('/api/users')
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe(newUser.username);
        expect(response.body.age).toBe(newUser.age);
        expect(response.body.hobbies).toEqual(newUser.hobbies);

        createdUserId = response.body.id;
    });

    // Test 3: GET user by ID
    it('should return created user on GET /api/users/{userId}', async () => {
        const response = await request(baseUrl).get(`/api/users/${createdUserId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdUserId);
        expect(response.body.username).toBe('John Doe');
    });

    // Test 4: PUT update user
    it('should update user on PUT /api/users/{userId}', async () => {
        const updatedData = {
            username: 'John Updated',
            age: 31,
            hobbies: ['coding', 'gaming', 'reading']
        };

        const response = await request(baseUrl)
            .put(`/api/users/${createdUserId}`)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdUserId);
        expect(response.body.username).toBe(updatedData.username);
        expect(response.body.age).toBe(updatedData.age);
    });

    // Test 5: DELETE user
    it('should delete user on DELETE /api/users/{userId}', async () => {
        const response = await request(baseUrl).delete(`/api/users/${createdUserId}`);

        expect(response.status).toBe(204);
    });

    // Test 6: GET deleted user (404)
    it('should return 404 on GET deleted user', async () => {
        const response = await request(baseUrl).get(`/api/users/${createdUserId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });
});
