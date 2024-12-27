const mongoose = require('mongoose');
const user = require('./user');

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

module.exports = mongoose.model('UserSkill', userSkillSchema);