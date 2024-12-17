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
            req.session.error_msg = 'Username and password are required';
            return res.status(400).redirect('/users/register');
        }

        if (password !== password2) {
            console.log('Passwords do not match');
            req.session.error_msg = 'Passwords do not match';
            return res.status(400).redirect('/users/register');
        }

        if (password.length < 6) {
            console.log('Password must be at least 6 characters');
            req.session.error_msg = 'Password must be at least 6 characters';
            return res.status(400).redirect('/users/register');
        }

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            console.log('Username already exists:', username);
            req.session.error_msg = 'Username already exists';
            return res.status(400).redirect('/users/register');
        }

        try {
            await createUser(username, password);
            console.log('User registered successfully:', username);
            req.session.success_msg = 'Register successful';
            res.redirect('/users/login');
        } catch (saveError) {
            console.error('Error saving user:', saveError);
            req.session.error = 'Error saving user';
            res.status(500).send('Error saving user');
        }
    } catch (error) {
        console.error('Registration error:', error);
        req.session.error = 'Error registering user';
        res.status(500).send('Error registering user');
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('Missing username or password');
            req.session.error_msg = 'Username and password are required';
            return res.status(400).redirect('/users/login');
        }

        const user = await findUserByUsername(username);
        if (!user) {
            console.log('Invalid username');
            req.session.error_msg = 'Invalid username';
            return res.status(400).redirect('/users/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Invalid password');
            req.session.error_msg = 'Invalid password';
            return res.status(400).redirect('/users/login');
        }

        req.session.user = user;
        req.session.success_msg = 'Login successful';
        res.redirect('/skills/electronics');
    } catch (error) {
        console.error('Login error:', error);
        req.session.error = 'Error logging in';
        res.status(500).redirect('/users/login');
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

exports.getAllUsers = async () => {
    try {
        return await User.find();
    } catch (error) {
        console.error('Error getting users:', error);
        throw new Error('Database query failed');
    }
};

exports.changePassword = async (userId, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }catch (error) {
        console.error('Error changing password:', error);
        throw new Error('Database query failed');
    }
};
