const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Skill = require('../models/skill');
const UserSkill = require('../models/userSkill');

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
    await Skill.deleteMany({});
    await UserSkill.deleteMany({});
});

describe('UserSkill Controller', () => {
    let user;
    let adminUser;
    let agent;

    beforeEach(async () => {
        user = new User({ username: 'user', password: 'password' });
        await user.save();

        adminUser = new User({ username: 'admin', password: 'password', admin: true });
        await adminUser.save();

        agent = request.agent(app);
        await agent
            .post('/users/login')
            .send({ username: 'admin', password: 'password' });
    });

    describe('POST /:skillTreeName/submit-evidence', () => {
        it('should submit skill evidence and return the user skill', async () => {
            const skill = new Skill({
                id: 'skill1',
                text: 'Skill 1',
                set: 'electronics',
                description: 'Skill description',
                tasks: ['Task 1'],
                resources: ['Resource 1'],
                score: 10,
                icon: 'icon.png'
            });
            await skill.save();

            const evidenceData = { skillId: skill._id, evidence: 'Evidence text' };

            const response = await agent
                .post('/skills/electronics/submit-evidence')
                .send(evidenceData);

            expect(response.status).toBe(200);
            expect(response.body.evidence).toBe(evidenceData.evidence);

            const userSkill = await UserSkill.findOne({ skill: skill._id, user: adminUser._id });
            expect(userSkill).not.toBeNull();
            expect(userSkill.evidence).toBe(evidenceData.evidence);
        });

        it('should return 400 if required fields are missing', async () => {
            const evidenceData = { skillId: '', evidence: '' };

            const response = await agent
                .post('/skills/electronics/submit-evidence')
                .send(evidenceData);

            expect(response.status).toBe(400);
        });

        it('should update existing user skill evidence', async () => {
            const skill = new Skill({
                id: 'skill1',
                text: 'Skill 1',
                set: 'electronics',
                description: 'Skill description',
                tasks: ['Task 1'],
                resources: ['Resource 1'],
                score: 10,
                icon: 'icon.png'
            });
            await skill.save();
        
            const userSkill = new UserSkill({ skill: skill._id, user: adminUser._id, evidence: 'Old evidence' });
            await userSkill.save();
        
            const evidenceData = { skillId: skill._id, evidence: 'New evidence', userSkillId: userSkill._id };
        
            const response = await agent
                .post('/skills/electronics/submit-evidence')
                .send(evidenceData);
        
            expect(response.status).toBe(200);
            expect(response.body.evidence).toBe(evidenceData.evidence);
        
            const updatedUserSkill = await UserSkill.findById(userSkill._id);
            expect(updatedUserSkill.evidence).toBe(evidenceData.evidence);
        });
    });

    describe('POST /:skillTreeName/:skillID/verify', () => {
        it('should verify a user skill submission and return the updated user skill', async () => {
            const skill = new Skill({
                id: 'skill1',
                text: 'Skill 1',
                set: 'electronics',
                description: 'Skill description',
                tasks: ['Task 1'],
                resources: ['Resource 1'],
                score: 10,
                icon: 'icon.png'
            });
            await skill.save();

            const userSkill = new UserSkill({ skill: skill._id, user: user._id, evidence: 'Evidence text' });
            await userSkill.save();

            const verificationData = { userSkillId: userSkill._id, approved: true };

            const response = await agent
                .post(`/skills/electronics/${skill._id}/verify`)
                .send(verificationData);

            expect(response.status).toBe(200);
            expect(response.body.verifications).toHaveLength(1);
            expect(response.body.verifications[0].approved).toBe(true);

            const updatedUserSkill = await UserSkill.findById(userSkill._id);
            expect(updatedUserSkill.verifications).toHaveLength(1);
            expect(updatedUserSkill.verifications[0].approved).toBe(true);
        });

        it('should return 404 if user skill is not found', async () => {
            const verificationData = { userSkillId: new mongoose.Types.ObjectId(), approved: true };

            const response = await agent
                .post(`/skills/electronics/${new mongoose.Types.ObjectId()}/verify`)
                .send(verificationData);

            expect(response.status).toBe(404);
        });

        it('should mark skill as completed if verified by an admin', async () => {
            const skill = new Skill({
                id: 'skill1',
                text: 'Skill 1',
                set: 'electronics',
                description: 'Skill description',
                tasks: ['Task 1'],
                resources: ['Resource 1'],
                score: 10,
                icon: 'icon.png'
            });
            await skill.save();

            const userSkill = new UserSkill({ skill: skill._id, user: user._id, evidence: 'Evidence text' });
            await userSkill.save();

            const verificationData = { userSkillId: userSkill._id, approved: true };

            const response = await agent
                .post(`/skills/electronics/${skill._id}/verify`)
                .send(verificationData);

            expect(response.status).toBe(200);

            const updatedUserSkill = await UserSkill.findById(userSkill._id);
            expect(updatedUserSkill.completed).toBe(true);
            expect(updatedUserSkill.completedAt).not.toBeNull();
        });

        it('should mark skill as completed if verified by at least 3 non-admin users', async () => {
            const skill = new Skill({
                id: 'skill1',
                text: 'Skill 1',
                set: 'electronics',
                description: 'Skill description',
                tasks: ['Task 1'],
                resources: ['Resource 1'],
                score: 10,
                icon: 'icon.png'
            });
            await skill.save();

            const userSkill = new UserSkill({ skill: skill._id, user: user._id, evidence: 'Evidence text' });
            await userSkill.save();

            const user1 = new User({ username: 'user1', password: 'password' });
            const user2 = new User({ username: 'user2', password: 'password' });
            const user3 = new User({ username: 'user3', password: 'password' });
            await user1.save();
            await user2.save();
            await user3.save();

            await UserSkill.findByIdAndUpdate(userSkill._id, {
                $push: {
                    verifications: [
                        { user: user1._id, approved: true, verifiedAt: new Date() },
                        { user: user2._id, approved: true, verifiedAt: new Date() },
                        { user: user3._id, approved: true, verifiedAt: new Date() }
                    ]
                }
            });

            const updatedUserSkill = await UserSkill.findById(userSkill._id);
            expect(updatedUserSkill.completed).toBe(true);
            expect(updatedUserSkill.completedAt).not.toBeNull();
        });
    });
});