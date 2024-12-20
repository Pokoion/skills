const skillService = require('../services/skill.service');

const getSkillNumber = async (req, res, next) => {
    try {
        const skillNum = await skillService.getSkillsCountBySets();
        res.locals.skillNum = skillNum;
    } catch (error) {
        res.locals.skillNum = null;
    }
    next();
}

module.exports = getSkillNumber;