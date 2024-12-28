const User = require('../models/user');
const bcrypt = require('bcrypt');
const messageHandler = require('../utils/messageHandler');
const userService = require('../services/user.service');

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

        const existingUser = await userService.findUserByUsername(username);
        if (existingUser) {
            console.log('Username already exists:', username);
            req.session.error_msg = 'Username already exists';
            return res.status(400).redirect('/users/register');
        }

        try {
            await userService.createUser(username, password);
            req.session.success_msg = 'User created successfully';
            res.status(201).redirect('/users/login');
        } catch (error) {
            console.error('Error creating user:', error);
            req.session.error_msg = 'Error creating user';
            res.status(500).redirect('/users/register');
        }
    } catch (error) {
        console.error('Error registering user:', error);
        req.session.error_msg = 'Error registering user';
        res.status(500).redirect('/users/register');
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userService.findUserByUsername(username);
        if (!user) {
            req.session.error_msg = 'Invalid username or password';
            return res.status(400).redirect('/users/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.error_msg = 'Invalid username or password';
            return res.status(400).redirect('/users/login');
        }

        req.session.user = user;
        req.session.success_msg = 'Logged in successfully';
        res.status(302).redirect('/skills/electronics');
    } catch (error) {
        console.error('Error logging in user:', error);
        req.session.error_msg = 'Error logging in user';
        res.status(500).redirect('/users/login');
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out user:', err);
            req.session.error_msg = 'Error logging out user';
            return res.status(500).redirect('/users/login');
        }
        res.status(302).redirect('/users/login');
    });
};

exports.getAllUsers = async (req, res) => {
    try {
        let users = await userService.findAllUsersWithPassword();
        users = users.map(user => {
            return {
                _id: user._id,
                username: user.username,
                admin: user.admin
            };
        });
        res.render('manageUsers', { users });
    } catch (error) {
        console.error('Error getting users:', error);
        req.session.error = 'Error getting users';
        res.status(500).redirect('/admin/dashboard');
    }
};

// Admin can put a password with less than 6 characters
exports.changePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        if (!userId || !newPassword) {
            req.session.error_msg = 'User ID and new password are required';
            return res.status(400).redirect('/admin/users');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await userService.updateUserPassword(userId, hashedPassword);
        if (!user) {
            req.session.error_msg = 'User not found';
            return res.status(404).redirect('/admin/users');
        }
        res.status(200).json(user);
    }catch (error) {
        req.session.error = 'Error changing password';
        res.status(500).redirect('/admin/users');
    }
};