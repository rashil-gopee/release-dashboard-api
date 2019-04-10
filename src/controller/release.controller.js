var fs = require('fs'),
	mongoose = require('mongoose'),
	multiparty = require('multiparty'),
	Grid = require('gridfs-stream'),
	config = require('../config/app.config');

mongoose.Promise = global.Promise;

var JiraClient = require('jira-connector');

var getRelease = function(req, res, next) {
	var jira = new JiraClient({
		host: 'releasedashboard.atlassian.net',
		basic_auth: {
			username: 'rashillgopee@gmail.com',
			password: 'Hy2c6Ja9GaBaZs8'
		}
	});

	// jira.issue.getIssue(
	// 	{
	// 		issueKey: 'RD-11'
	// 	},
	// 	function(error, issue) {
	// 		console.log('error', error);
	// 		console.log('issue', issue.fields.fixVersions);
	// 	}
	// );

	// jira.issue.getIssuePicker(
	// 	{
	// 		query: 'version=AprilOOCR'
	// 	},
	// 	function(error, issue) {
	// 		console.log('error', error);
	// 		console.log('issue', issue);
	// 	}
	// );

	let query = {
		jql: 'project = 10001 & fixVersion = AprilOOCR',
		maxResults: 100,
		startAt: 0,
		fields: ['summary', 'description'],
		fieldsByKeys: false
	};

	jira.search.search(query, (err, issues) => {
		console.log(issues);
	});

	jira.project.getAllProjects({}, function(error, projects) {
		console.log('error', error);
		console.log('projects', projects);
		projects.forEach(project => {
			console.log('Project Id', project.id);
			jira.project.getVersions({ projectIdOrKey: project.id }, function(
				error,
				versions
			) {
				console.log('error', error);
				console.log('versions', versions);
				versions.forEach(version => {
					jira.version.getUnresolvedIssueCount(
						{ versionId: version.id },
						function(error, issues) {
							console.log('issues', issues);
						}
					);
				});
			});
		});
		next();
	});
};

exports.getRelease = getRelease;
