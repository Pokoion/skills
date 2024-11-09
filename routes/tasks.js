const express = require('express');
const router = express.Router();

const skills = require('../public/skills.json');

/* GET tasks page. */
router.get('/', (req, res) => {
    const skillId = req.query.id;
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
        res.render('tasks', skill);
    } else {
        res.status(404);
        res.render('error', {
            message: 'Skill not found',
            error: {
                status: 404,
                stack: 'The requested skill could not be found in the database.'
            }
        });
    }
});

module.exports = router;