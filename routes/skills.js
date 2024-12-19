const express = require('express');
const router = express.Router();

const skillController = require('../controllers/skill.controller');
const authMiddleware = require('../middleware/auth');
const messageHandler = require('../utils/messageHandler');

router.get('/', authMiddleware.isAuthenticated, (req, res) => res.redirect('/skills/electronics'));

router.get('/:skillTreeName', authMiddleware.isAuthenticated, skillController.loadSkillsTree);

router.get('/:skillTree/add', authMiddleware.isAdmin, (req, res) => res.render('addSkill'));

router.post('/:skillTreeName/add', authMiddleware.isAdminPost, skillController.addSkill);

router.get('/:skillTreeName/view/:skillID', authMiddleware.isAuthenticated, skillController.viewSkillById);

router.post('/:skillTreeName/:skillID/verify', authMiddleware.isAuthenticated, (req, res) => res.send(`Skill ${req.params.skillID} verified`));

router.get('/:skillTree/edit/:skillID', authMiddleware.isAdmin, skillController.editSkillById);

router.post('/:skillTreeName/submit-evidence', authMiddleware.isAuthenticated, (req, res) => res.send('Evidence Submitted'));

router.post('/:skillTreeName/delete/:skillID', authMiddleware.isAdminPost, (req, res) => res.send(`Skill ${req.params.skillID} deleted`));

router.get('/:skillTreeName/skills', authMiddleware.isAuthenticated, skillController.getAllSkills);

module.exports = router;