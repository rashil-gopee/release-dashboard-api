const utils = require('../utils');
const async = require('async');


//= =======================================
// User Routes
//= =======================================

/**
 * It loads all the users from JIRA.
 * @param {object} req request from the client
 * @param {object} res response back to the client
 * @param {function} next function which should executed next
 */
exports.getUsers = function (req, res, next) {
	utils.jira.createJiraClient(req, function () {
		if (Array.isArray(req.erm.result)) {
			async.map(req.erm.result, getJiraUserDetails, function (err, results) {
				next();
			});
		}
		else {
			utils.jira.getJiraClient().user.getUser({ username: req.erm.result.jiraUsername }, function (error, response) {
				for (var k in response) {
					req.erm.result[k] = response[k];
				}
				next();
			});
		}
	});
};

/**
 * It loads user details from JIRA which related from the given user).
 * @param {object} project a single project to load
 * @param {function} next function which should executed next
 */
function getJiraUserDetails(user, next) {
	utils.jira.getJiraClient().user.getUser({ username: user.jiraUsername }, function (error, response) {
		for (var k in response) {
			user[k] = response[k];
		}
		next(false, user);
	});
}

// export functions to serve API functionalities
exports.getJiraUserDetails = getJiraUserDetails;