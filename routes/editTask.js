const express = require('express');
const router = express.Router();

const skills = require('../public/skills.json');

/* GET tasks page. */
router.get('/:id', (req, res) => {
    console.log(req.params);
    const skillId = req.params.id;
    console.log(skillId);
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
        res.render('editTask', skill);
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