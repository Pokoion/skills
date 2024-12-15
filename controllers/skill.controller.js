const Skill = require('../models/skill');

exports.findSkillById = async (id, res) => {
    try {
      const skill = await Skill.findOne({ id });
      if (skill) {
        return skill;
      } else {
        res.status(404).render('error', {
          message: 'Skill not found',
          error: {
            status: 404,
            stack: 'The requested skill could not be found in the database.'
          }
        });
        return null;
      }
    } catch (error) {
      res.status(500).render('error', {
        message: 'An error occurred while retrieving the skill',
        error: {
          status: 500,
          stack: error.stack
        }
      });
      return null;
    }
  };