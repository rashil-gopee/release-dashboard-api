const utils = require('../utils');
const async = require('async');


//= =======================================
// User Routes
//= =======================================
exports.getUsers = function (req, res, next) {
	utils.jira.createJiraClient(req, function () {
		if (Array.isArray(req.erm.result)) {
			async.map(req.erm.result, getJiraUserDetails, function (err, results) {
				next();
			});
		}
		else {
			utils.jira.getJiraClient().user.getUser({ username: req.erm.result.jiraAccountId }, function (error, response) {
				for (var k in response) {
					req.erm.result[k] = response[k];
				}
				next();
			});
		}
	});
};

function getJiraUserDetails(user, next) {
	utils.jira.getJiraClient().user.getUser({ accountId: user.jiraAccountId }, function (error, response) {
		for (var k in response) {
			user[k] = response[k];
		}
		next(false, user);
	});
}