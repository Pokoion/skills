const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    text: { type: String, required: true, unique: true },
    set: { type: String, required: true },
    tasks: { type: [String], required: true },
    resources: { type: [String], required: true },
    description: { type: String, required: true },
    score: { type: Number, default: 1 },
    icon: { type: String, required: true },
});

module.exports = mongoose.model('Skill', skillSchema);