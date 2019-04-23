const utils = require('../utils');

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

exports.getProjects = getProjects;