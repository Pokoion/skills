const express = require('express');
const router = express.Router();

const skillController = require('../controllers/skill.controller');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.isAuthenticated, (req, res) => res.redirect('/skills/electronics'));

router.get('/:skillTreeName', authMiddleware.isAuthenticated, (req, res) => res.render('index'));

router.get('/:skillTree/add', authMiddleware.isAdmin, (req, res) => {
    res.render('addSkill', { skillTreeName: req.params.skillTree });
});

router.post('/:skillTreeName/add', authMiddleware.isAdminPost, (req, res) => res.send(`Skill added to ${req.params.skillTreeName}`));

router.get('/:skillTreeName/view/:skillID', authMiddleware.isAuthenticated, async (req, res) => {
  try {
    const skillId = req.params.skillID;
    const skill = await skillController.findSkillById(skillId);

    res.render('tasks', skill);
  } catch (error) {
    res.status(error.status || 500).render('error', {
      message: error.message,
      error: {
        status: error.status || 500,
        stack: error.stack || 'No stack available'
      }
    });
  }
});

router.post('/:skillTreeName/:skillID/verify', authMiddleware.isAuthenticated, (req, res) => res.send(`Skill ${req.params.skillID} verified`));

router.get('/:skillTree/edit/:skillID', authMiddleware.isAdmin, async (req, res) => {
  try {
    const skillId = req.params.skillID;
    const skill = await skillController.findSkillById(skillId);

    res.render('editSkill', skill);
  } catch (error) {
    res.status(error.status || 500).render('error', {
      message: error.message,
      error: {
        status: error.status || 500,
        stack: error.stack || 'No stack available'
      }
    });
  }
});

router.post('/:skillTreeName/submit-evidence', authMiddleware.isAuthenticated, (req, res) => res.send('Evidence Submitted'));

router.post('/:skillTreeName/delete/:skillID', authMiddleware.isAdminPost, (req, res) => res.send(`Skill ${req.params.skillID} deleted`));

router.get('/:skillTreeName/skills', async (req, res) => { 
  try {
    const skills = await skillController.getAllSkills();
    res.send(skills);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message,
      error: {
        status: error.status || 500,
        stack: error.stack || 'No stack available'
      }
    });
}
});

module.exports = router;