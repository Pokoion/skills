const express = require('express');
const router = express.Router();

const badges = require('../public/badges.json');

/* GET leaderboard page. */
router.get('/badges', (req, res) => {
    res.render('manageBadges', { badges });
});

module.exports = router;