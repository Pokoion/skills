exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    console.log('User is not authenticated');
    return res.redirect('/users/login');
  }
  next();
};

exports.isAlreadyAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/skills');
  }
  next();
};

const isAdmin = (isPost = false) => (req, res, next) => {
  exports.isAuthenticated(req, res, () => {
    if (req.session.user.admin) {
      return next();
    }
    if (isPost) {
      return res.status(403).send('You are not authorized to perform this action.');
    }
    return res.redirect('/skills');
  });
};

exports.isAdmin = isAdmin(false); // For GET requests
exports.isAdminPost = isAdmin(true); // For POST requests