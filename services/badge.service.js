const Badge = require('../models/badge');

exports.findBadgeById = async (id) => {
    return await Badge.findById(id);
};

exports.findAllBadges = async () => {
    return await Badge.find();
};

exports.deleteBadgeById = async (id) => {
    return await Badge.findByIdAndDelete(id);
};

exports.editBadgeById = async (id, updateData) => {
    return await Badge.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};