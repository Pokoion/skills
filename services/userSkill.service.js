const UserSkill = require('../models/userSkill');

exports.getUserSkillBySkillAndUser = async (skillId, userId) => {
    try {
      return await UserSkill.findOne({ skill: skillId, user: userId }).populate('skill').populate('user');
    } catch (error) {
      console.error('Error al obtener UserSkill:', error);
      throw error;
    }
  };
  
  // Otros métodos de tu servicio
  exports.getAllUserSkills = async () => {
    return await UserSkill.find();
  };
  
  exports.addUserSkill = async (userSkillData) => {
    return await UserSkill.create(userSkillData);
  };
  
  exports.updateUserSkillById = async (userSkillId, userSkillData) => {
    return await UserSkill.updateOne({ _id: userSkillId }, userSkillData);
  };
  
  exports.deleteUserSkillById = async (userSkillId) => {
    return await UserSkill.deleteOne({ _id: userSkillId });
  };
  
  exports.getUserSkillsByUserId = async (userId) => {
    return await UserSkill.find({ user: userId }).populate('skill');
  };
  
  exports.getUserSkillsBySkillId = async (skillId) => {
    return await UserSkill.find({ skill: skillId }).populate('user');
  };