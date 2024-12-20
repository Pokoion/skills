const validateSkillInput = (req, res, next) => {
    console.log(req.body);
    if (!req.body.text || !req.body.description || !req.body.tasks || !req.body.resources) {
      req.session.error_msg = 'All fields are required';
      return res.status(400).redirect(`/skills/${req.params.skillTreeName}/add`);
    }
  
    if (req.body.text.trim() == '' || req.body.description.trim() == '') {
      req.session.error_msg = 'All fields are required';
      return res.status(400).redirect(`/skills/${req.params.skillTreeName}/add`);
    }
  
    const resources = req.body.resources.split('\r\n').filter(resource => resource.trim() != '');
    if (resources.length < 1) {
      req.session.error_msg = 'At least one resource is required';
      return res.status(400).redirect(`/skills/${req.params.skillTreeName}/add`);
    }
  
    const tasks = req.body.tasks.split('\r\n').filter(task => task.trim() != '');
    if (tasks.length < 1) {
      req.session.error_msg = 'At least one task is required';
      return res.status(400).redirect(`/skills/${req.params.skillTreeName}/add`);
    }
    next();
  };

  module.exports = validateSkillInput;