const Badge = require('../models/badge');
const messageHandler = require('../utils/messageHandler');
const badgeService = require('../services/badge.service');

exports.getBadgeById = async (req, res) => {
  try {
    const badgeId = req.params.id;
    const badge = await badgeService.findBadgeById(badgeId);
    if (!badge) {
      req.session.error_msg = 'Badge not found';
      return res.status(404).redirect('/admin/badges');
    }
    res.render('editBadge', { badge });
  } catch (error) {
      console.error('Error finding badge:', error.stack);
      req.session.error = 'Error finding badge';
      return res.status(500).redirect('/admin/badges');
  }
};

exports.getAllBadgesAdmin = async (req, res) => {
  try {
    badges = await badgeService.findAllBadges();
    res.status(200).render('admin-badges', { badges});
  } catch (error) {
    req.session.error = 'Error getting badges';
    res.status(500).redirect('/admin/dashboard');
  }
};

exports.getAllBadgesUsers = async (req, res) => {
  try {
    badges = await badgeService.findAllBadges();
    res.status(200).render('leaderboard', { badges });
  } catch (error) {
    req.session.error = 'Error getting badges';
    res.status(500).redirect('/skills/electronics');
  }
};

exports.deleteBadgeById = async (req, res) => {
  try {
    const badgeId = req.params.id;
    const badge = await badgeService.deleteBadgeById(badgeId);
    if (!badge) {
      req.session.error_msg = 'Badge not found';
      return res.status(404).redirect('/admin/badges');
    }
    req.session.success_msg = 'Badge deleted';
    res.status(200).redirect('/admin/badges');
  } catch (error) {
    console.error('Error deleting badge:', error.stack);
    req.session.error = 'Error deleting badge';
    res.status(500).redirect('/admin/badges');
  }
}
