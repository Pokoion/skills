const Skill = require('../models/skill');

exports.getSkillById = async (id) => {
  return await Skill.findOne({id});
}

exports.getAllSkills = async () => {
  return await Skill.find();
}

exports.getAllTreeSkills = async (skillTreeName) => {
  return await Skill.find({set: skillTreeName});
}

exports.addSkill = async (skillData) => {
  return await Skill.create(skillData);
}

exports.getSkillCount = async () => {
  return await Skill.countDocuments();
}

exports.deleteSkillbyId = async (skillId) => {
  return await Skill.deleteOne({id: skillId});
}

exports.editSkillById = async (skillId, skillData) => {
  return await Skill.updateOne({id: skillId}, skillData);
}

exports.getSkillsByTree = async (skillTreeName) => {
  return await Skill.find({set: skillTreeName});
}

exports.getSkillsNumberByTree = async (skillTreeName) => {
  return await Skill.countDocuments({set: skillTreeName}) || 0;
}

exports.generateSkillUniqueId = async () => {
  const maxSkill = await Skill.aggregate([
    { $project: { id: { $toInt: "$id" } } },  // Convierte id a un número
    { $sort: { id: -1 } },  // Ordena numéricamente
    { $limit: 1 }  // Solo toma el primer registro (el más alto)
  ]);

  return maxSkill.length ? (maxSkill[0].id + 1).toString() : '1';
};

exports.getSkillsCountBySets = async () => {
  try {
    const skillCountBySets = await Skill.aggregate([
      {
        $group: {
          _id: "$set",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {};
    skillCountBySets.forEach(group => {
      result[group._id] = group.count;
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};