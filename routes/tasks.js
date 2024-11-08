const express = require('express');
const router = express.Router();

const skills = require('../public/skills.json');

router.get('/', (req, res) => {
    const skillId = req.query.id;
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
        res.render('tasks', skill);
    } else {
        res.status(404).send('Skill not found');
    }
});

module.exports = router;