var fs = require('fs'),
	mongoose = require('mongoose'),
	multiparty = require('multiparty'),
	Grid = require('gridfs-stream'),
	config = require('../config/app.config');

mongoose.Promise = global.Promise;

var JiraClient = require('jira-connector');
const async = require('async');

var jira = new JiraClient({
	host: 'releasedashboard.atlassian.net',
	basic_auth: {
		username: 'rashillgopee@gmail.com',
		password: 'Hy2c6Ja9GaBaZs8'
	}
});

var getRelease = function (req, res, next) {
	let object;

	jira.project.getAllProjects({}, function (error, projects) {
		object = JSON.parse(JSON.stringify(projects));

		async.map(object, getVersions, function (err, results) {
			console.log('results', results);
			res.send(results);
		});
	});
};

function getVersions(project, next) {
	jira.project.getVersions(
		{
			projectIdOrKey: project.id,
			expand: ['operations']
		},
		function (error, versions) {
			project.versions = JSON.parse(JSON.stringify(versions));
			async.map(project.versions, getIssues, function (err, results) {
				next(false, project);
			});
		});
}

function getIssues(version, next) {
	let query = {
		jql: 'project = ' + version.projectId + ' & fixVersion = ' + version.name,
		maxResults: 100,
		startAt: 0,
		fields: ['summary', 'description'],
		fieldsByKeys: false
	};

	jira.search.search(query, (err, issues) => {
		version.issues = JSON.parse(JSON.stringify(issues));
		next(false, version);
	});
}

exports.getRelease = getRelease;
