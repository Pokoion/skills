const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Badge = require('../models/badge');
const User = require('../models/user');

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
    await Badge.deleteMany({});
    await User.deleteMany({});
});

describe('Badge Controller', () => {
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

    describe('POST /admin/badges/edit/:id', () => {
        it('should edit a badge and redirect if user is admin', async () => {
            const badge = new Badge({ name: 'Badge 1', bitpoints_min: 10, bitpoints_max: 20, image_url: 'badge1.png' });
            await badge.save();

            const updatedBadgeData = { name: 'Updated Badge', bitpoints_min: 15, bitpoints_max: 25, image_url: 'updatedbadge.png' };

            const response = await agent
                .post(`/admin/badges/edit/${badge._id}`)
                .send(updatedBadgeData);

            expect(response.headers.location).toBe('/admin/badges');

            const updatedBadge = await Badge.findById(badge._id);
            expect(updatedBadge.name).toBe(updatedBadgeData.name);
            expect(updatedBadge.bitpoints_min).toBe(updatedBadgeData.bitpoints_min);
            expect(updatedBadge.bitpoints_max).toBe(updatedBadgeData.bitpoints_max);
            expect(updatedBadge.image_url).toBe(updatedBadgeData.image_url);
        });

        it('should redirect if badge is not found', async () => {
            const updatedBadgeData = { name: 'Updated Badge', bitpoints_min: 15, bitpoints_max: 25, image_url: 'updatedbadge.png' };

            const response = await agent
                .post(`/admin/badges/edit/${new mongoose.Types.ObjectId()}`) // Usar un ID válido de MongoDB
                .send(updatedBadgeData);

            const badge = await Badge.findOne({ name: updatedBadgeData.name });
            expect(badge).toBeNull();
            expect(response.headers.location).toBe('/admin/badges');
        });
    });

    describe('POST /admin/badges/delete/:id', () => {
        it('should delete a badge and redirect if user is admin', async () => {
            const badge = new Badge({ name: 'Badge 1', bitpoints_min: 10, bitpoints_max: 20, image_url: 'badge1.png' });
            await badge.save();

            const response = await agent
                .post(`/admin/badges/delete/${badge._id}`);

            expect(response.headers.location).toBe('/admin/badges');

            const deletedBadge = await Badge.findById(badge._id);
            expect(deletedBadge).toBeNull();
        });

        it('should redirect if badge is not found', async () => {
            const id = new mongoose.Types.ObjectId();
            const response = await agent
                .post(`/admin/badges/delete/${id}`); // Usar un ID válido de MongoDB

            const badge = await Badge.findById(id);
            expect(badge).toBeNull();
            expect(response.headers.location).toBe('/admin/badges');
        });
    });
});