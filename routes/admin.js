const express = require('express');
const router = express.Router();
const badges = require('../public/badges.json');

const badgeController = require('../controllers/badge.controller');
const authMiddleware = require('../middleware/auth');

router.get('/dashboard', authMiddleware.isAdmin, (req, res) => res.render('dashboard'));

router.get('/badges', authMiddleware.isAdmin, (req, res) => {
    res.render('admin-badges', { badges });
});

router.get('/badges/edit/:id', authMiddleware.isAdmin, (req, res) => {
    const badgeId = req.params.id;
    const badge = badgeController.findBadgeById(badgeId, res);

    if (badge) {
      res.render('editBadge', badge);
    }
});

router.post('/badges/edit/:id', authMiddleware.isAdminPost, (req, res) => res.send(`Badge ${req.params.id} updated`));
router.post('/badges/delete/:id', authMiddleware.isAdminPost, (req, res) => res.send(`Badge ${req.params.id} deleted`));
router.get('/users', authMiddleware.isAdmin, (req, res) => res.render('manageUsers'));
router.post('/change-password', authMiddleware.isAdminPost, (req, res) => res.send('Admin Password Changed'));

module.exports = router;