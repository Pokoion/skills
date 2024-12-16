const Skill = require('../models/skill');

exports.findSkillById = async (id) => {
  try {
    const skill = await Skill.findOne({ id });
    if (!skill) {
      throw { status: 404, message: 'Skill not found' };
    }
    return skill;
  } catch (error) {
    throw error.status
      ? error
      : { status: 500, message: 'An error occurred while retrieving the skill', stack: error.stack };
  }
};

exports.getAllSkills = async () => {
  try {
    return await Skill.find();
  } catch (error) {
    throw error.status
      ? error
      : { status: 500, message: 'An error occurred while retrieving the skills', stack: error.stack };
  }
};