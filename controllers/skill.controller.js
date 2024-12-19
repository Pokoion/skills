const Skill = require('../models/skill');
const skillService = require('../services/skill.service');
const messageHandler = require('../utils/messageHandler');

exports.viewSkillById = async (req, res) => {
  try {
    const skill = await skillService.getSkillById(req.params.skillID);
    if (!skill) {
      req.session.error_msg = 'Skill not found';
      return res.status(404).redirect('/skills/electronics');
    }
    res.status(200).render('tasks', skill);
  } catch (error) {
    req.session.error = 'Error getting skill';
    res.status(500).redirect('/skills/electronics');
  }
};

exports.editSkillById = async (req, res) => {
  try {
    const skill = await skillService.getSkillById(req.params.skillID);
    if (!skill) {
      req.session.error_msg = 'Skill not found';
      return res.status(404).redirect('/skills/electronics');
    }
    res.status(200).render('editSkill', skill);
  } catch (error) {
    req.session.error = 'Error getting skill';
    res.status(500).redirect('/skills/electronics');
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await skillService.getAllSkills();
    res.status(200).send(skills);
  } catch (error) {
    req.session.error = 'Error getting skills';
    res.status(500).redirect('/skills/electronics');
  }
};

exports.loadSkillsTree = async (req, res) => {
  try {
    const messages = messageHandler.handleMessages(req);
    res.render('index', { messages });
  } catch (error) {
    req.session.error = 'Error loading skills tree';
    res.status(500).redirect('/skills/electronics');
  }
};

exports.addSkill = async (req, res) => {
  try {
    const skillData = req.body;
    const skillTreeName = req.params.skillTreeName;
    console.log(skillData);
    skillData.set = skillTreeName;
    skillData.tasks =  skillData.tasks.split('\n');
    skillData.resources = skillData.resources.split('\n');
    skillData.icon = "icon1.svg";
    skillData.id = skillService.getTreeSkillCount(skillTreeName) + 1;
    console.log(skillData);

    const skill = await skillService.addSkill(skillData);
    res.status(201).json(skill);
  } catch (error) {
    console.log(error);
    req.session.error = 'Error adding skill';
    res.status(500).redirect('/skills/electronics');
  }
}