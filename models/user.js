const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Skill = require('./skill');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    score: { type: Number, default: 0 },
    admin: { type: Boolean, default: false },
    completedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill', default: [] }]
});

userSchema.pre('save', async function(next) {
    try {
        if (this.password && this.isModified('password')) {
            console.log('Hashing password for user:', this.username);
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        console.error('Error in password hashing:', error);
        next(error);
    }
});

userSchema.pre('save', async function(next) {
    try {
        const userCount = await mongoose.model('User').countDocuments();
        if (userCount === 0) {
            console.log('First user detected, setting admin to true for:', this.username);
            this.admin = true;
        }
        next();
    } catch (error) {
        console.error('Error in admin setup:', error);
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);