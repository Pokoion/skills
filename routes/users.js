var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');

const badges = require('../public/badges.json');

router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;

        // Check username and password are provided
        if (!username || !password || !confirmPassword) {
            console.log('Missing username or password');
            return res.status(400).send('Username and password are required');
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            console.log('Missing username or password');
            return res.status(400).send('Passwords do not match.');
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Username already exists:', username);
            return res.status(400).send('Username already exists');
        }

        // Create new user
        const user = new User({ username, password });
        try {
            await user.save();
            console.log('User registered successfully:', username);
            res.status(201).send('User registered successfully.');
        } catch (saveError) {
            console.error('Error saving user:', saveError);
            res.status(500).send('Error saving user');
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Error registering user');
    }
});

router.get('/login', (req, res) => res.render('login'));

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check username and password are provided
        if (!username || !password) {
            console.log('Missing username or password');
            return res.status(400).send('Username and password are required');
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            console.log('Invalid username');
            return res.status(400).send('Invalid username');
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        // Return error if password is incorrect
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        req.session.user = user;
        res.redirect('/users/skills/electronics');

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error searching for user');
    }
});

router.get('/logout', (req, res) => res.send('User Logged Out'));

router.get('/leaderboard', (req, res) => res.render('leaderboard', { badges }));

router.get('/skills/:treeName', (req, res) => {
    res.render('index')
});

router.get('/skills/:treeName/view/:skillID', (req, res) => res.send(`View User Skill ${req.params.skillID}`));
router.get('/skills/:treeName/edit/:skillID', (req, res) => res.send(`Edit User Skill ${req.params.skillID}`));
router.post('/skills/:treeName/edit/:skillID', (req, res) => res.send(`User Skill ${req.params.skillID} Updated`));

module.exports = router;
