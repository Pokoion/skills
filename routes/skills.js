const express = require('express');
const router = express.Router();

const skills = require('../public/skills.json');

router.get('/:skillTree/edit/:skillID', (req, res) => {
    const skillId = req.params.skillID;
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

router.get('/:skillTree/add', (req, res) => {
    res.render('addTask');
});

router.get('/:skillTreeName/view/:skillID', (req, res) => {
    const skillId = req.params.skillID;
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

router.get('/', (req, res) => res.redirect('/skills/electronics'));
router.get('/:skillTreeName', (req, res) => res.render('index'));
router.post('/:skillTreeName/add', (req, res) => res.send(`Skill added to ${req.params.skillTreeName}`));
router.post('/:skillTreeName/:skillID/verify', (req, res) => res.send(`Skill ${req.params.skillID} verified`));
router.post('/:skillTreeName/submit-evidence', (req, res) => res.send('Evidence Submitted'));
router.post('/:skillTreeName/delete/:skillID', (req, res) => res.send(`Skill ${req.params.skillID} deleted`));

module.exports = router;