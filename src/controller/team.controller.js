const utils = require('../utils');
const async = require('async');

/**
 * It loads all the teams from JIRA and added in mongodb.
 * @param {object} req request from the client
 * @param {object} res response back to the client
 * @param {function} next function which should executed next
 */
exports.getTeams = function (req, res, next) {
	utils.jira.createJiraClient(req, function () {
		if (Array.isArray(req.erm.result)) {
			async.map(req.erm.result, getProject, function (err, results) {
				next();
			});
		}
		else {
			utils.jira.getJiraClient().project.getProject({ projectIdOrKey: req.erm.result.jiraProjectId },
				function (error, jiraProject) {
					for (var k in jiraProject) {
						if (k != 'issueTypes' && k != 'versions')
							req.erm.result[k] = jiraProject[k];
					}
					next();
				});
		}
	});
};

/**
 * It loads project from JIRA which related from the given project  (from monogodb).
 * @param {object} project a single project to load
 * @param {function} next function which should executed next
 */
function getProject(project, next) {
	utils.jira.getJiraClient().project.getProject({ projectIdOrKey: project.jiraProjectId },
		function (error, jiraProject) {
			for (var k in jiraProject) {
				if (k != 'issueTypes' && k != 'versions')
					project[k] = jiraProject[k];
			}
			next(false, project);
		});
}