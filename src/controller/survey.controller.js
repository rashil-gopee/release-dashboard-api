var jwt = require('jsonwebtoken'),
	crypto = require('crypto'),
	model = require('../model'),
	User = model.user,
	utils = require('../utils'),
	sendmail = utils.sendmail,
	bulkmail = utils.bulkmail,
	helper = utils.helper,
	setUserInfo = helper.setUserInfo,
	getRole = helper.getRole,
	config = require('../config/app.config');

exports.mailDistribute = function(req, res, next) {
	// Check for registration errors
	// const to = req.body.to;
	// const password = req.body.password;

	bulkmail(
		req.body.fromName,
		req.body.to,
		req.body.subject,
		null,
		req.body.htmlMailContent,
		function(err, sent) {
			if (err) return res.sendStatus(400);
			else
				return res.status(200).json({
					message: 'Invites has been sent'
				});
		}
	);
};
