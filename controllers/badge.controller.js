const badgeService = require('../services/badge.service');
const InputUtil = require('../utils/input.util');

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
    res.status(200).render('admin-badges', { badges });
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

exports.editBadgeById = async (req, res) => {
  try {
    const badgeId = req.params.id;
    const badge = await badgeService.findBadgeById(badgeId);

    if (!badge) {
      req.session.error_msg = 'Badge not found';
      return res.status(404).redirect('/admin/badges');
    }

    const result = await checkAndReturnEditInfo(req, res);
    if (result.error) {
      req.session.error_msg = result.message;
      return res.status(result.status).redirect('/admin/badges');
    }

    const badgeData = result.badgeData;
    const updatedBadge = await badgeService.editBadgeById(badgeId, badgeData);
    if (!updatedBadge) {
      req.session.error_msg = 'Error updating badge';
      return res.status(500).redirect('/admin/badges');
    }

    req.session.success_msg = 'Badge updated';
    return res.status(200).redirect('/admin/badges');
  } catch (error) {
    console.error('Error updating badge:', error.stack);
    req.session.error = 'Error updating badge';
    return res.status(500).redirect('/admin/badges');
  }
}

const checkAndReturnEditInfo = (req, res) => {
  const badgeData = {};

  if (req.body.name && InputUtil.hasContentString(req.body.name)) {
    badgeData.name = req.body.name.trim();
  }

  if (req.body.bitpoints_min) {
    if (isNaN(req.body.bitpoints_min)) {
      return {
        error: true,
        status: 400,
        message: 'Bitpoints min must be a number',
        badgeData: null
      };
    }
    if (parseInt(req.body.bitpoints_min) < 0) {
      return {
        error: true,
        status: 400,
        message: 'Bitpoints min must be greater than 0',
        badgeData: null
      };
    }
    badgeData.bitpoints_min = req.body.bitpoints_min;
  }

  if (req.body.bitpoints_max) {
    if (isNaN(req.body.bitpoints_max)) {
      return {
        error: true,
        status: 400,
        message: 'Bitpoints max must be a number',
        badgeData: null
      };
    }
    if (parseInt(req.body.bitpoints_max) < 0) {
      return {
        error: true,
        status: 400,
        message: 'Bitpoints max must be greater than 0',
        badgeData: null
      };
    }
      if (parseInt(req.body.bitpoints_max) < parseInt(req.body.bitpoints_min)) {
        return {
          error: true,
          status: 400,
          message: 'Bitpoints max must be greater than bitpoints min',
          badgeData: null
        };
      }
      badgeData.bitpoints_max = req.body.bitpoints_max;
    }

    if (req.body.image_url && InputUtil.hasContentString(req.body.image_url)) {
      badgeData.image_url = req.body.image_url.trim();
    }

    if (Object.keys(badgeData).length === 0) {
      return {
        error: true,
        status: 400,
        message: 'No data to update',
        skillData: null
      };
    }

    return { error: false, status: 200, badgeData };
  }
