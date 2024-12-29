const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/user');
const { session } = require('passport');

let mongoServer;

// Connect to the in-memory database.
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Close the connection and stop MongoMemoryServer.
afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

// Clear all test data after every test.
beforeEach(async () => {
    await User.deleteMany({});
});

describe('User Controller', () => {
    describe('POST /users/register', () => {
        it('should return redirect to register if passwords do not match', async () => {
            const newUser = { username: 'newuser', password: 'password', password2: 'differentpassword' };

            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            const user = await User.findOne({ username: newUser.username });
            expect(user).toBeNull();
            expect(response.headers.location).toBe('/users/register');
        });

        it('should return redirect to register if username already exists', async () => {
            const existingUser = new User({ username: 'existinguser', password: 'password' });
            await existingUser.save();

            const newUser = { username: 'existinguser', password: 'password', password2: 'password' };

            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            const userCount = await User.countDocuments({ username: newUser.username });
            expect(userCount).toBe(1);
            expect(response.headers.location).toBe('/users/register');
        });

        it('should register a new user and redirect to login', async () => {
            const newUser = { username: 'newuser', password: 'password', password2: 'password' };

            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            expect(response.headers.location).toBe('/users/login');

            const user = await User.findOne({ username: newUser.username });
            expect(user).not.toBeNull();
            expect(user.username).toBe(newUser.username);
        });
    });

    describe('POST /users/login', () => {
        it('should login a user and redirect to skills', async () => {
            const user = new User({ username: 'user', password: 'password' });
            await user.save();

            const loginData = { username: 'user', password: 'password' };

            const response = await request(app)
                .post('/users/login')
                .send(loginData);

            expect(response.headers.location).toBe('/skills/electronics');
        });

        it('should redirect to login if username is invalid', async () => {
            const loginData = { username: 'invaliduser', password: 'password' };

            const response = await request(app)
                .post('/users/login')
                .send(loginData);

            expect(response.headers.location).toBe('/users/login');
            expect(session.user).toBeUndefined();
        });

        it('should redirect to login if password is invalid', async () => {
            const user = new User({ username: 'user', password: await bcrypt.hash('password', 10) });
            await user.save();

            const loginData = { username: 'user', password: 'invalidpassword' };

            const response = await request(app)
                .post('/users/login')
                .send(loginData);

            expect(response.headers.location).toBe('/users/login');
            expect(session.user).toBeUndefined();
        });
    });

    describe('GET /users/logout', () => {
        it('should logout a user and destroy the session', async () => {
            const user = new User({ username: 'user', password: 'password' });
            await user.save();

            const agent = request.agent(app);
            await agent
                .post('/users/login')
                .send({ username: 'user', password: 'password' });

            const response = await agent.get('/users/logout');

            expect(response.headers.location).toBe('/users/login');
            const checkSessionResponse = await agent.get('/users/leaderboard');
            expect(checkSessionResponse.headers.location).toBe('/users/login');
        });
    });

    describe('POST /admin/change-password', () => {
        let adminUser;
        let agent;

        beforeEach(async () => {
            adminUser = new User({ username: 'admin', password: 'password', admin: true });
            await adminUser.save();

            agent = request.agent(app);
            await agent
                .post('/users/login')
                .send({ username: 'admin', password: 'password' });
        });

        it('should change the password if userId and newPassword are provided', async () => {
            const user = new User({ username: 'user', password: 'oldpassword' });
            await user.save();

            const changePasswordData = { userId: user._id, newPassword: 'newpassword' };

            const response = await agent
                .post('/admin/change-password')
                .send(changePasswordData);

            expect(response.status).toBe(200);
            const isMatchJSON = await bcrypt.compare('newpassword', response.body.password);
            expect(isMatchJSON).toBe(true);
            const updatedUser = await User.findById(user._id);
            const isMatch = await bcrypt.compare('newpassword', updatedUser.password);
            expect(isMatch).toBe(true);
        });

        it('should redirect if userId or newPassword is missing', async () => {
            const changePasswordData = { userId: '', newPassword: '' };

            const response = await agent
                .post('/admin/change-password')
                .send(changePasswordData);

            expect(response.headers.location).toBe('/admin/users');
        });

        it('should redirect if user is not found', async () => {
            const id = new mongoose.Types.ObjectId();
            const changePasswordData = { userId: id, newPassword: 'newpassword' };

            const response = await agent
                .post('/admin/change-password')
                .send(changePasswordData);

            const user = await User.findById(id);
            expect(user).toBeNull();
            expect(response.headers.location).toBe('/admin/users');
        });
    });
});