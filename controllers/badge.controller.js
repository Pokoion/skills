const Badge = require('../models/badge');

exports.findBadgeById = async (id, res) => {
    try {
      const badge = await Badge.findById({ id });
      if (badge) {
        return badge;
      } else {
        res.status(404).render('error', {
          message: 'Badge not found',
          error: {
            status: 404,
            stack: 'The requested badge could not be found in the database.'
          }
        });
        return null;
      }
    } catch (error) {
      res.status(500).render('error', {
        message: 'An error occurred while retrieving the badge',
        error: {
          status: 500,
          stack: error.stack
        }
      });
      return null;
    }
  };