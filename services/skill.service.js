const Skill = require('../models/skill');

exports.getSkillById = async (id) => {
  return await Skill.findOne({id});
}

exports.getAllSkills = async () => {
  return await Skill.find();
}

exports.addSkill = async (skillData) => {
  return await Skill.create(skillData);
}

exports.getTreeSkillCount = async (skillTreeName) => {  
  return await Skill.countDocuments({set: skillTreeName});
}