const InputUtil = require('../utils/input.util');

const validateSkillInput = (req, res, next) => {
    console.log(req.body);
    if (!req.body.text || !req.body.description || !req.body.tasks || !req.body.resources) {
      req.session.error_msg = 'All fields are required';
      return res.status(400).redirect(`/skills/${req.params.skillTreeName}`);
    }
  
    if (!InputUtil.hasContentString(req.body.text) || !InputUtil.hasContentString(req.body.description)) {
      req.session.error_msg = 'All fields are required';
      return res.status(400).redirect(`/skills/${req.params.skillTreeName}`);
    }
  
    const resources = InputUtil.convertStringToArray(req.body.resources);
    if (resources.length < 1) {
      req.session.error_msg = 'At least one resource is required';
      return res.status(400).redirect(`/skills/${req.params.skillTreeName}`);
    }
  
    const tasks = InputUtil.convertStringToArray(req.body.tasks);
    if (tasks.length < 1) {
      req.session.error_msg = 'At least one task is required';
      return res.status(400).redirect(`/skills/${req.params.skillTreeName}`);
    }

    if (isNaN(req.body.score.trim())) {
        req.session.error_msg = 'Score must be a number';
        return res.status(400).redirect(`/skills/${req.params.skillTreeName}`);
    }
    next();
  };

  module.exports = validateSkillInput;