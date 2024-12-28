const mongoose = require('mongoose');
const User = require('./user');

const userSkillSchema = new mongoose.Schema({
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    evidence: { type: String, default: null },
    verifications: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          approved: { type: Boolean, required: true },
          verifiedAt: { type: Date, required: true },
        }
      ],
});

// Middleware pre-update
userSkillSchema.pre('findOneAndUpdate', async function (next) {
  try {
      const update = this.getUpdate();
      const userSkillId = this.getQuery()._id;

      if (update.$push && update.$push.verifications) {
        let verificationsToAdd = update.$push.verifications;
        if (!Array.isArray(verificationsToAdd)) {
            verificationsToAdd = [verificationsToAdd];  // Convert to array if not already
        }

        const existingUserSkill = await this.model.findById(userSkillId).populate('skill');
        if (!existingUserSkill) {
            throw new Error('UserSkill not found');
        }

        const existingVerifications = existingUserSkill.verifications || [];
        const allVerifications = [...existingVerifications, ...verificationsToAdd];

          const verifiedUsers = allVerifications.filter(v => v.approved);

          if (verifiedUsers.length === 0) {
              update.$set = update.$set || {};
              update.$set.completed = false;
              return next();
          }

          // Verify if any of the approvers is an admin
          const adminApproval = await Promise.all(
              verifiedUsers.map(async v => {
                  const user = await User.findById(v.user);
                  return user && user.admin;
              })
          );

          let skillCompleted = false;

          if (adminApproval.includes(true)) {
              skillCompleted = true;
              update.$set = update.$set || {};
              update.$set.completed = true;
              update.$set.completedAt = new Date();
          }

          // Verify if there are at least 3 non-admin approvals
          console.log('All verifications:', verifiedUsers);
          const uniqueApprovedUsers = new Set(verifiedUsers.map(v => v.user.toString()));
          console.log('Unique approved users:', uniqueApprovedUsers);
          if (uniqueApprovedUsers.size >= 3) {
              skillCompleted = true;
              update.$set = update.$set || {};
              update.$set.completed = true;
              update.$set.completedAt = new Date();
          }

          if (skillCompleted) {
              const skillId = existingUserSkill.skill;
              const userId = existingUserSkill.user;
          
              // Add the skill to the user's completed skills if not already there
              const user = await User.findById(userId);
              if (user && !user.completedSkills.includes(skillId)) {
                  user.score += existingUserSkill.skill.score;
                  user.completedSkills.push(skillId);
                  await user.save();
              }
          } else {
              update.$set = update.$set || {};
              update.$set.completed = false;
          }
      }

      // Continuar con la actualización
      next();
  } catch (error) {
      // Manejo de errores
      next(error);
  }
});


module.exports = mongoose.model('UserSkill', userSkillSchema);