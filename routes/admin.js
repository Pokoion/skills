const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const badgeController = require('../controllers/badge.controller');
const authMiddleware = require('../middleware/auth');
const badgeUpload = require('../middleware/badgeUpload');

router.get('/dashboard', authMiddleware.isAdmin, (req, res) => res.render('dashboard'));

router.get('/badges', authMiddleware.isAdmin, badgeController.getAllBadgesAdmin);

router.get('/badges/edit/:id', authMiddleware.isAdmin, badgeController.getBadgeById);

router.post('/badges/edit/:id', authMiddleware.isAdminPost, badgeUpload.single('image_url') ,badgeController.editBadgeById);

router.post('/badges/delete/:id', authMiddleware.isAdminPost, badgeController.deleteBadgeById);

router.get('/users', authMiddleware.isAdmin, userController.getAllUsers);

router.post('/change-password', authMiddleware.isAdminPost, userController.changePassword);

module.exports = router;