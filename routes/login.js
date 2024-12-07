var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/user');

router.get('/', function(req, res, next) {
    res.redirect('/login');
});

module.exports = router;