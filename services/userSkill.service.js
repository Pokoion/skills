const UserSkill = require('../models/userSkill');

exports.submitSkillEvidence = async (skillId, userId, evidence) => {
    try {
      const userSkill = new UserSkill({ skill: skillId, user: userId, evidence });
      return await userSkill.save();
    } catch (error) {
      console.error('Error submitting evidence:', error);
      throw error;
    }
};

exports.updateUserSkillById = async (userSkillId) => {
    try {
      return await UserSkill.findByIdAndUpdate(userSkillId, { evidence }, { new: true });
    } catch (error) {
      console.error('Error updating UserSkill:', error);
      throw error;
    }
};

exports.getAllUncompletedUserSkillsBySkillId = async (skillId) => {
    try {
      return await UserSkill.find({ skill: skillId, completed: false }).populate('user');
    } catch (error) {
      console.error('Error al obtener UserSkill:', error);
      throw error;
    }
};

exports.verifyUserSkillById = async (userSkillId, verification) => {
  try {
      return await UserSkill.findByIdAndUpdate(
          userSkillId,
          {
            $push: { verifications: verification },
          },
          { new: true }
      );
  } catch (error) {
      console.error('Error updating UserSkill:', error);
      throw error;
  }
};

exports.getUserSkillBySkillAndUser = async (skillId, userId) => {
    try {
      return await UserSkill.findOne({ skill: skillId, user: userId }).populate('skill').populate('user');
    } catch (error) {
      console.error('Error al obtener UserSkill:', error);
      throw error;
    }
  };
  
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