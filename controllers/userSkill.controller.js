const userSkillService = require('../services/userSkill.service');

exports.submitSkillEvidence = async (req, res) => {
    try {
        const skillId = req.body.skillId;
        const userId = req.session.user._id;
        const evidence = req.body.evidence;
        if (!skillId || !userId || !evidence) {
            req.session.error_msg = 'Missing required fields';
            return res.status(400);
        }
        if (req.body.userSkillId) {
            const userSkill = await userSkillService.updateUserSkillById(req.body.userSkillId, { evidence });
            if (userSkill) {
                res.status(200).json(userSkill);
            } else {
                res.status(404).send('UserSkill not found');
            }
            return;
        }
        const userSkill = await userSkillService.submitSkillEvidence(skillId, userId, evidence);
        if (userSkill) {
        res.status(200).json(userSkill);
        } else {
        res.status(404).send('Error submitting evidence');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting evidence' });
    }
}

exports.verifySubmission = async (req, res) => {
    try {
        const verification = {
            user: req.session.user._id,
            approved: req.body.approved,
            verifiedAt: new Date()
        }
        const userSkill = await userSkillService.verifyUserSkillById(req.body.userSkillId, verification);
        if (userSkill) {
            res.status(200).json(userSkill);
        } else {
            res.status(404).send('UserSkill not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying submission' });
    }
}