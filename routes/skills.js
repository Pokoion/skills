const express = require('express');
const router = express.Router();

const skillController = require('../controllers/skill.controller');
const skills = require('../public/skills.json');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.isAuthenticated, (req, res) => res.redirect('/skills/electronics'));

router.get('/:skillTreeName', authMiddleware.isAuthenticated, (req, res) => res.render('index'));

router.get('/:skillTree/add', authMiddleware.isAdmin, (req, res) => {
    res.render('addTask');
});

router.post('/:skillTreeName/add', authMiddleware.isAdminPost, (req, res) => res.send(`Skill added to ${req.params.skillTreeName}`));

router.get('/:skillTreeName/view/:skillID', authMiddleware.isAuthenticated, (req, res) => {
    const skillId = req.params.skillID;
    const skill = skillController.findSkillById(skillId, res);

    if (skill) {
      res.render('editBadge', badge);
    }
});

router.post('/:skillTreeName/:skillID/verify', authMiddleware.isAuthenticated, (req, res) => res.send(`Skill ${req.params.skillID} verified`));

router.get('/:skillTree/edit/:skillID', authMiddleware.isAdmin, (req, res) => {
    const skillId = req.params.skillID;
    const skill = skillController.findSkillById(skillId, res);

    if (skill) {
      res.render('editTask', skill);
    }
});

router.post('/:skillTreeName/submit-evidence', authMiddleware.isAuthenticated, (req, res) => res.send('Evidence Submitted'));

router.post('/:skillTreeName/delete/:skillID', authMiddleware.isAdminPost, (req, res) => res.send(`Skill ${req.params.skillID} deleted`));

module.exports = router;