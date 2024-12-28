const express = require('express');
const router = express.Router();

const skillController = require('../controllers/skill.controller');
const userSkillController = require('../controllers/userSkill.controller');
const authMiddleware = require('../middleware/auth');
const validateSkillInput = require('../middleware/validateSkillInput');
const iconUpload = require('../middleware/iconUpload');
const messageHandler = require('../utils/messageHandler');
const skill = require('../models/skill');

router.get('/', authMiddleware.isAuthenticated, (req, res) => res.redirect('/skills/electronics'));

router.get('/:skillTreeName', authMiddleware.isAuthenticated, skillController.loadSkillsTree);

router.get('/:skillTreeName/add', authMiddleware.isAdmin, (req, res) => res.render('addSkill', { skillTreeName: req.params.skillTreeName }));

router.post('/:skillTreeName/add', authMiddleware.isAdminPost, iconUpload.single('icon'), validateSkillInput, skillController.addSkill);

router.get('/:skillTreeName/view/:skillID', authMiddleware.isAuthenticated, skillController.viewSkillById);

router.post('/:skillTreeName/:skillID/verify', authMiddleware.isAuthenticated, userSkillController.verifySubmission);

router.get('/:skillTreeName/edit/:skillID', authMiddleware.isAdmin, skillController.loadEditSkillById);

router.post('/:skillTreeName/edit/:skillID', authMiddleware.isAdmin, iconUpload.single('icon'), skillController.editSkillById);

router.post('/:skillTreeName/submit-evidence', authMiddleware.isAuthenticated, userSkillController.submitSkillEvidence);

router.post('/:skillTreeName/delete/:skillID', authMiddleware.isAdminPost, skillController.deleteSkill);

router.get('/:skillTreeName/skills', authMiddleware.isAuthenticated, skillController.getAllSkills);

module.exports = router;