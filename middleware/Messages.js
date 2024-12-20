const messageHandler = require('../utils/messageHandler');

const messageMiddleware = (req, res, next) => {
  const messages = messageHandler.handleMessages(req);
  res.locals.messages = messages;
  next();
};

module.exports = messageMiddleware;