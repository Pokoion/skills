var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/user');

router.get('/', function(req, res, next) {
    res.redirect('/register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            console.log('Missing username or password');
            return res.status(400).send('Username and password are required');
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
            res.redirect('/');
        } catch (saveError) {
            console.error('Error saving user:', saveError);
            res.status(500).send('Error saving user');
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Error registering user');
    }
});

module.exports = router;