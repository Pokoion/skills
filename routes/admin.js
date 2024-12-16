const express = require('express');
const router = express.Router();

const badgeController = require('../controllers/badge.controller');
const authMiddleware = require('../middleware/auth');

router.get('/dashboard', authMiddleware.isAdmin, (req, res) => res.render('dashboard'));

router.get('/badges', authMiddleware.isAdmin, async (req, res) => {
    const badges = await badgeController.getAllBadges();
    res.render('admin-badges', { badges });
});

router.get('/badges/edit/:id', authMiddleware.isAdmin, async (req, res) => {
  try {
    const badgeId = req.params.badgeId;
    const badge = await badgeController.findBadgeById(badgeId);

    res.render('editBadge', badge);
  } catch (error) {
    res.status(error.status || 500).render('error', {
      message: error.message,
      error: {
        status: error.status || 500,
        stack: error.stack || 'No stack available'
      }
    });
  }
});

router.post('/badges/edit/:id', authMiddleware.isAdminPost, (req, res) => res.send(`Badge ${req.params.id} updated`));
router.post('/badges/delete/:id', authMiddleware.isAdminPost, (req, res) => res.send(`Badge ${req.params.id} deleted`));
router.get('/users', authMiddleware.isAdmin, (req, res) => res.render('manageUsers'));
router.post('/change-password', authMiddleware.isAdminPost, (req, res) => res.send('Admin Password Changed'));

module.exports = router;