const handleMessages = (req) => {
    const messages = {
        success_msg: req.session.success_msg || '',
        error_msg: req.session.error_msg || '',
        error: req.session.error || ''
    };

    req.session.success_msg = '';
    req.session.error_msg = '';
    req.session.error = '';
    console.log("messages created");
    return messages;
};

module.exports = { handleMessages };