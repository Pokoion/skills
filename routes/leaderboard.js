const express = require('express');
const router = express.Router();

const badges = require('../public/badges.json');

/* GET leaderboard page. */
router.get('/', (req, res) => {
    res.render('leaderboard', { badges });
});

module.exports = router;