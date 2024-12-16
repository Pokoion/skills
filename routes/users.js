var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');

const badges = require('../public/badges.json');

router.get('/register', authMiddleware.isAlreadyAuthenticated, (req, res) => res.render('register'));

router.post('/register', userController.registerUser);

router.get('/login', authMiddleware.isAlreadyAuthenticated, (req, res) => res.render('login'));

router.post('/login', userController.loginUser);

router.get('/logout', authMiddleware.isAuthenticated, userController.logoutUser);

router.get('/leaderboard', authMiddleware.isAuthenticated, (req, res) => {
    res.render('leaderboard', { badges });
});   

router.get('/about', (req, res) => res.render('about'));

module.exports = router;
