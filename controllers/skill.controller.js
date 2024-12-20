const skillService = require('../services/skill.service');

exports.viewSkillById = async (req, res) => {
  try {
    const skill = await skillService.getSkillById(req.params.skillID);
    if (!skill) {
      req.session.error_msg = 'Skill not found';
      return res.status(404).redirect(`/skills/${req.params.skillTreeName}`);
    }
    res.status(200).render('tasks', skill);
  } catch (error) {
    req.session.error = 'Error getting skill';
    res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
  }
};

exports.loadEditSkillById = async (req, res) => {
  try {
    const skill = await skillService.getSkillById(req.params.skillID);
    if (!skill) {
      req.session.error_msg = 'Skill not found';
      return res.status(404).redirect(`/skills/${req.params.skillTreeName}`);
    }
    res.status(200).render('editSkill', { skill, skillTreeName: req.params.skillTreeName });
  } catch (error) {
    req.session.error = 'Error getting skill';
    res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await skillService.getAllTreeSkills(req.params.skillTreeName);
    res.status(200).send(skills);
  } catch (error) {
    req.session.error = 'Error getting skills';
    res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
  }
};

exports.loadSkillsTree = async (req, res) => {
  try {
    res.render('index', { skillTreeName: req.params.skillTreeName });
  } catch (error) {
    req.session.error = 'Error loading skills tree';
    res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
  }
};

exports.addSkill = async (req, res) => {
  try {
    const skillTreeName = req.params.skillTreeName;
    const tasks = req.body.tasks.split('\r\n').filter(task => task.trim() != '');
    const resources = req.body.resources.split('\r\n').filter(resource => resource.trim() != '');

    const skillData = {
      id: await skillService.generateSkillUniqueId(),
      text: req.body.text,
      icon: req.file.filename,
      description: req.body.description,
      tasks: tasks,
      resources: resources,
      set: skillTreeName
    };
    if (req.body.score && req.body.score.trim() !== '') {
      skillData.score = req.body.score;
    }
    console.log(skillData);

    const skill = await skillService.addSkill(skillData);
    req.session.success_msg = 'Skill added successfully';
    res.status(201).redirect(`/skills/${req.params.skillTreeName}`);
  } catch (error) {
    console.log(error);
    req.session.error = 'Error adding skill';
    res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
  }
}

exports.deleteSkill = async (req, res) => {
  try {
    const skillId = req.params.skillID;
    const skill = await skillService.getSkillById(skillId);
    if (!skill) {
      req.session.error_msg = 'Skill not found';
      return res.status(404).redirect(`/skills/${req.params.skillTreeName}`);
    }
    await skillService.deleteSkillbyId(skillId);
    req.session.success_msg = 'Skill deleted successfully';
    res.status(200).redirect(`/skills/${req.params.skillTreeName}`);
  }
  catch (error) {
    req.session.error = 'Error deleting skill';
    res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
  }
}

exports.editSkillById = async (req, res) => {
  try {
    const skillId = req.params.skillID;
    const skill = await skillService.getSkillById(skillId);
    if (!skill) {
      req.session.error_msg = 'Skill not found';
      return res.status(404).redirect(`/skills/${req.params.skillTreeName}`);
    }
    const skillData = {};
    console.log(req.body);
    if (req.body.text) {
      skillData.text = req.body.text.trim();
    }
    if (req.body.description) {
      skillData.description = req.body.description.trim();
    }
    if (req.body.tasks) {
      skillData.tasks = req.body.tasks.split('\r\n').filter(task => task.trim() != '');
    }
    if (req.body.resources) {
      skillData.resources = req.body.resources.split('\r\n').filter(resource => resource.trim() != '');
    }
    if (req.body.score) {
      skillData.score = req.body.score.trim();
    }
    if (req.file) {
      skillData.icon = req.file.filename;
    }

    if (Object.keys(skillData).length === 0) {
      req.session.error_msg = 'No changes made';
      return res.status(400).redirect(`/skills/${req.params.skillTreeName}`);
    }

    const editedSkill = await skillService.editSkillById(skillId, skillData);
    if (!editedSkill) {
      req.session.error_msg = 'Skill could not be edited';
      return res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
    }
    req.session.success_msg = 'Skill edited successfully';
    res.status(200).redirect(`/skills/${req.params.skillTreeName}`);

  }
  catch (error) {
    console.log(error);
    req.session.error = 'Error editing skill';
    res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
  }
}
