const utils = require('../utils');

var JiraClient = require('jira-connector');
const async = require('async');

var verifyProject = function () {
	let object;
	utils.jira.getJiraClient().project.getAllProjects({}, function (error, projects) {
		object = JSON.parse(JSON.stringify(projects));

		async.map(object, getVersions, function (err, results) {
			console.log('results', results);
			// res.send(results);
			return results;
		});

	});
};

exports.verifyProject = verifyProject;