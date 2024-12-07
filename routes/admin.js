const express = require('express');
const router = express.Router();

const badges = require('../public/badges.json');

router.get('/dashboard', (req, res) => res.send('Admin Dashboard'));

router.get('/badges', (req, res) => {
    res.render('admin-badges', { badges });
});

router.get('/badges/edit/:id', (req, res) => {
    const badgeId = req.params.id;
    const badge = badges.find(b => b.rango === badgeId);

    if (badge) {
        res.render('editBadge', badge);
    } else {
        res.status(404);
        res.render('error', {
            message: 'Badge not found',
            error: {
                status: 404,
                stack: 'The requested badge could not be found in the database.'
            }
        });
    }
});

router.post('/badges/edit/:id', (req, res) => res.send(`Badge ${req.params.id} updated`));
router.post('/badges/delete/:id', (req, res) => res.send(`Badge ${req.params.id} deleted`));
router.get('/users', (req, res) => res.send('Admin Users List'));
router.post('/change-password', (req, res) => res.send('Admin Password Changed'));

module.exports = router;