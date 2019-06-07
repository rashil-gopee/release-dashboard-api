const utils = require('../utils');

/**
 * It connecto to JIRA to fetch all the projects
 * @param {object} req request from the client
 * @param {object} res response back to the client
 * @param {function} next function which should executed next
 */
var getProjects = function (req, res, next) {
	utils.jira.createJiraClient(req, function () {
		utils.jira.getJiraClient().project.getAllProjects({}, function (error, projects) {
			if (error)
				res.send(error);
			else
				res.send(projects);
		});
	});
};

// export functions to serve API functionalities
exports.getProjects = getProjects;