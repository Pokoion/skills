const skillService = require('../services/skill.service');
const userSkillService = require('../services/userSkill.service');
const InputUtil = require('../utils/input.util');

exports.viewSkillById = async (req, res) => {
  try {
    const skill = await skillService.getSkillById(req.params.skillID);
    if (!skill) {
      req.session.error_msg = 'Skill not found';
      return res.status(404).redirect(`/skills/${req.params.skillTreeName}`);
    }
    const userSkill = await userSkillService.getUserSkillBySkillAndUser(skill._id, req.session.user._id);
    const skillSubmissions = await userSkillService.getAllUncompletedUserSkillsBySkillId(skill._id);
    console.log('submissions:');
    console.log(skillSubmissions);
    console.log('userSkill:');
    console.log(userSkill);
    res.status(200).render('tasks', {skill, userSkill, skillTreeName: req.params.skillTreeName, skillSubmissions});
  } catch (error) {
    console.error(error);
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

    const skillData = {
      id: await skillService.generateSkillUniqueId(),
      text: req.body.text.trim(),
      icon: req.file.filename,
      description: req.body.description.trim(),
      tasks: InputUtil.convertStringToArray(req.body.tasks.trim()),
      resources: InputUtil.convertStringToArray(req.body.resources.trim()),
      set: req.params.skillTreeName
    };
    if (req.body.score.trim() != '') {
      skillData.score = req.body.score.trim();
    }
    const skill = await skillService.addSkill(skillData);
    if (!skill) {
      req.session.error_msg = 'Skill could not be added';
      return res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
    }
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

    const result = await checkAndReturnEditInfo(req, res);
    if (result.error) {
      req.session.error_msg = result.message;
      return res.status(result.status).redirect(`/skills/${req.params.skillTreeName}`);
    }

    const skillData = result.skillData;
    const editedSkill = await skillService.editSkillById(skillId, skillData);
    if (!editedSkill) {
      req.session.error_msg = 'Skill could not be edited';
      return res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
    }

    req.session.success_msg = 'Skill edited successfully';
    return res.status(200).redirect(`/skills/${req.params.skillTreeName}`);
  } catch (error) {
    console.log(error);
    req.session.error = 'Error editing skill';
    return res.status(500).redirect(`/skills/${req.params.skillTreeName}`);
  }
}

const checkAndReturnEditInfo = (req, res) => {
  const skillData = {};

  if (req.body.text && InputUtil.hasContentString(req.body.text)) {
    skillData.text = req.body.text.trim();
  }
  if (req.body.description && InputUtil.hasContentString(req.body.description)) {
    skillData.description = req.body.description.trim();
  }
  if (req.body.tasks) {
    const filteredTasks = InputUtil.convertStringToArray(req.body.tasks);
    if (filteredTasks.length > 0) {
      skillData.tasks = filteredTasks;
    }
  }
  if (req.body.resources) {
    const filteredResources = InputUtil.convertStringToArray(req.body.resources);
    if (filteredResources.length > 0) {
      skillData.resources = filteredResources;
    }
  }

  if (req.body.score) {
    if (isNaN(req.body.score.trim())) {
      return { 
        error: true, 
        status: 400,
        message: 'Score must be a number', 
        skillData: null 
      };
    }
    skillData.score = req.body.score.trim();
  }

  if (req.file && req.file.filename) {
    skillData.icon = req.file.filename;
  }

  if (Object.keys(skillData).length === 0) {
    return { 
      error: true, 
      status: 400,
      message: 'No data to update', 
      skillData: null 
    };
  }

  return { error: false, status: 200, skillData };
}
