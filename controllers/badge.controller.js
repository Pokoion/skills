const Badge = require('../models/badge');

exports.findBadgeById = async (id) => {
  try {
    const badge = await Badge.findById(id);
    if (!badge) {
      throw { status: 404, message: 'Badge not found' };
    }
    return badge;
  } catch (error) {
    throw error.status
      ? error
      : { status: 500, message: 'An error occurred while retrieving the badge', stack: error.stack };
  }
};

exports.getAllBadges = async () => {
  try {
    return await Badge.find();
  } catch (error) {
    throw error.status
      ? error
      : { status: 500, message: 'An error occurred while retrieving the badges', stack: error.stack };
  }
};