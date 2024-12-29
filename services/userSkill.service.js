const UserSkill = require('../models/userSkill');

exports.submitSkillEvidence = async (skillId, userId, evidence) => {
  const userSkill = new UserSkill({ skill: skillId, user: userId, evidence });
  return await userSkill.save();
};

exports.updateUserSkillById = async (userSkillId, evidence) => {
      const result = await UserSkill.findByIdAndUpdate(
          userSkillId,
          { evidence },
          { new: true }
      );
      return result;
};

exports.getAllUncompletedUserSkillsBySkillId = async (skillId) => {
  return await UserSkill.find({ skill: skillId, completed: false }).populate('user');
};

exports.verifyUserSkillById = async (userSkillId, verification) => {
  return await UserSkill.findByIdAndUpdate(
    userSkillId,
    {
      $push: { verifications: verification },
    },
    { new: true }
  );
};

exports.getUserSkillBySkillAndUser = async (skillId, userId) => {
  return await UserSkill.findOne({ skill: skillId, user: userId }).populate('skill').populate('user');
};

// Get the count of unverified user skills for a given skill, excluding the ones verified by the user
exports.getUnverifiedUserSkillCount = async (skillId, userId) => {
  return await UserSkill.countDocuments({
    skill: skillId,
    completed: false,
    'verifications.user': { $ne: userId }
  });
};

exports.getAllUserSkills = async () => {
  return await UserSkill.find();
};

exports.addUserSkill = async (userSkillData) => {
  return await UserSkill.create(userSkillData);
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