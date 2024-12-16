const User = require('../models/user');
const bcrypt = require('bcrypt');

const createUser = async (username, password) => {
    const user = new User({ username, password });
    return await user.save();
};

const findUserByUsername = async (username) => {
    return await User.findOne({ username });
};

exports.registerUser = async (req, res) => {
    try {
        const { username, password, password2 } = req.body;

        if (!username || !password || !password2) {
            console.log('Missing username or password');
            return res.status(400).send('Username and password are required');
        }

        if (password !== password2) {
            console.log('Passwords do not match');
            return res.status(400).send('Passwords do not match.');
        }

        if (password.length < 6) {
            console.log('Password must be at least 6 characters');
            return res.status(400).send('Password must be at least 6 characters');
        }

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            console.log('Username already exists:', username);
            return res.status(400).send('Username already exists');
        }

        try {
            await createUser(username, password);
            console.log('User registered successfully:', username);
            res.status(201).send('User registered successfully');
        } catch (saveError) {
            console.error('Error saving user:', saveError);
            res.status(500).send('Error saving user');
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Error registering user');
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('Missing username or password');
            return res.status(400).send('Username and password are required');
        }

        const user = await findUserByUsername(username);
        if (!user) {
            console.log('Invalid username');
            return res.status(400).send('Invalid username');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        req.session.user = user;
        res.redirect('/skills');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error searching for user');
    }
};

exports.logoutUser = (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).send('Error logging out');
            }
            res.redirect('/users/login');
        });
    } else {
        res.redirect('/users/login');
    }
};