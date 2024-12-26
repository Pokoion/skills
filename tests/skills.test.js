const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Skill = require('../models/skill');
const User = require('../models/user');
const path = require('path');
const exp = require('constants');

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
    await Skill.deleteMany({});
    await User.deleteMany({});
});

describe('Skill Controller', () => {
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

    describe('POST /:skillTreeName/add', () => {
        it('should add a skill and redirect if user is admin', async () => {
            const skillData = {
                text: 'New Skill',
                description: 'Skill description',
                tasks: 'Task 1\r\nTask 2',
                resources: 'Resource 1\r\nResource 2',
                score: '10'
            };

            const response = await agent
                .post('/skills/electronics/add')
                .field('text', skillData.text)
                .field('description', skillData.description)
                .field('tasks', skillData.tasks)
                .field('resources', skillData.resources)
                .field('score', skillData.score)
                .attach('icon', path.join(__dirname, '../public/icons/icon1.svg'));

            expect(response.headers.location).toBe('/skills/electronics');

            const skill = await Skill.findOne({ id: '1' });
            expect(skill).not.toBeNull();
            expect(skill.text).toBe(skillData.text);
            expect(skill.description).toBe(skillData.description);
            expect(skill.tasks).toEqual(skillData.tasks.split('\r\n'));
            expect(skill.resources).toEqual(skillData.resources.split('\r\n'));
            expect(skill.score).toBe(parseInt(skillData.score));
        });

        it('should redirect if skill could not be added', async () => {
            const skillData = {
                description: '',
                tasks: '',
                resources: '',
                score: ''
            };

            const response = await agent
                .post('/skills/electronics/add')
                .field('description', skillData.description)
                .field('tasks', skillData.tasks)
                .field('resources', skillData.resources)
                .field('score', skillData.score)
                .attach('icon', path.join(__dirname, '../public/icons/icon1.svg'));

            expect(response.headers.location).toBe('/skills/electronics');
            const skill = await Skill.findOne({ id: '1' });
            expect(skill).toBeNull();
        });
    });

    describe('POST /:skillTreeName/edit/:skillID', () => {
        it('should edit a skill and redirect if user is admin', async () => {
            const skillData = {
                text: 'New Skill',
                description: 'Skill description',
                tasks: 'Task 1\r\nTask 2',
                resources: 'Resource 1\r\nResource 2',
                score: '10'
            };

            const addResponse = await agent
                .post('/skills/electronics/add')
                .field('text', skillData.text)
                .field('description', skillData.description)
                .field('tasks', skillData.tasks)
                .field('resources', skillData.resources)
                .field('score', skillData.score)
                .attach('icon', path.join(__dirname, '../public/icons/icon1.svg'));

            const updatedSkillData = {
                text: 'Updated Skill',
                description: 'Updated description',
                tasks: 'Updated Task 1\r\nUpdated Task 2',
                resources: 'Updated Resource 1\r\nUpdated Resource 2',
                score: '20'
            };

            const response = await agent
                .post('/skills/electronics/edit/1')
                .field('text', updatedSkillData.text)
                .field('description', updatedSkillData.description)
                .field('tasks', updatedSkillData.tasks)
                .field('resources', updatedSkillData.resources)
                .field('score', updatedSkillData.score)
                .attach('icon', path.join(__dirname, '../public/icons/icon1.svg'));

            expect(response.headers.location).toBe('/skills/electronics');

            const updatedSkill = await Skill.findOne({ id: '1' });
            expect(updatedSkill).not.toBeNull();
            expect(updatedSkill.text).toBe(updatedSkillData.text);
            expect(updatedSkill.description).toBe(updatedSkillData.description);
            expect(updatedSkill.tasks).toEqual(updatedSkillData.tasks.split('\r\n'));
            expect(updatedSkill.resources).toEqual(updatedSkillData.resources.split('\r\n'));
        });

        it('should redirect if skill is not found', async () => {
            const updatedSkillData = {
                text: 'Updated Skill',
                description: 'Updated description',
                tasks: 'Updated Task 1\r\nUpdated Task 2',
                resources: 'Updated Resource 1\r\nUpdated Resource 2',
                score: '20'
            };

            const response = await agent
                .post('/skills/electronics/edit/1')
                .field('text', updatedSkillData.text)
                .field('description', updatedSkillData.description)
                .field('tasks', updatedSkillData.tasks)
                .field('resources', updatedSkillData.resources)
                .field('score', updatedSkillData.score)
                .attach('icon', path.join(__dirname, '../public/icons/icon1.svg'));

            expect(response.headers.location).toBe('/skills/electronics');
            const updatedSkill = await Skill.findOne({ id: '1' });
            expect(updatedSkill).toBeNull();
        });
    });

    describe('POST /:skillTreeName/delete/:skillID', () => {
        it('should delete a skill and redirect if user is admin', async () => {
            const skillData = {
                text: 'New Skill',
                description: 'Skill description',
                tasks: 'Task 1\r\nTask 2',
                resources: 'Resource 1\r\nResource 2',
                score: '10'
            };

            const addResponse = await agent
                .post('/skills/electronics/add')
                .field('text', skillData.text)
                .field('description', skillData.description)
                .field('tasks', skillData.tasks)
                .field('resources', skillData.resources)
                .field('score', skillData.score)
                .attach('icon', path.join(__dirname, '../public/icons/icon1.svg'));

            const response = await agent
                .post('/skills/electronics/delete/1');

            expect(response.headers.location).toBe('/skills/electronics');

            const deletedSkill = await Skill.findOne({ id: '1' });
            expect(deletedSkill).toBeNull();
        });

        it('should redirect if skill is not found', async () => {
            const response = await agent
                .post('/skills/electronics/delete/1');

            expect(response.headers.location).toBe('/skills/electronics');
            const skill = await Skill.findOne({ id: '1' });
            expect(skill).toBeNull();
        });
    });
});