const User = require('../models/user');

exports.createUser = async (username, password) => {
    const user = new User({ username, password });
    return await user.save();
};

exports.findUserByUsername = async (username) => {
    return await User.findOne({ username });
};

exports.findAllUsers = async () => {
    return await User.find();
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