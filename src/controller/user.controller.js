const utils = require('../utils');
const async = require('async');


//= =======================================
// User Routes
//= =======================================
exports.getUsers = function (req, res, next) {
	// utils.jira.createJiraClient(req, function () {
	// 	if (Array.isArray(req.erm.result)) {
	// 		async.map(req.erm.result, getProjects, function (err, results) {
	// 			next();
	// 		});
	// 	}
	// 	else {
	// 		async.map(req.erm.result.projects, getVersion, function (err, results) {
	// 			next();
	// 		});
	// 	}
	// });
	next();
};

// function getJiraUserDetails(user){
// 	utils.jira.getJiraClient().
// }