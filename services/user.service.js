const User = require('../models/user');

exports.createUser = async (username, password) => {
  let user;
  if (!password) {
    user = new User({ username });
  } else {
    user = new User({ username, password });
  }
  return await user.save();
};

exports.findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

exports.findAllUsers = async () => {
  return await User.find();
};

exports.findAllUsersWithPassword = async () => {
  return await User.find({ password: { $exists: true } });
};

exports.updateUserPassword = async (userId, hashedPassword) => {
  try {
    const user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
    return user;
  } catch (error) {
    console.error(`Error updating password for user ${userId}:`, error.message);
    throw new Error('Failed to update password');
  }
};