const utils = require('../utils');
const async = require('async');

var getReleases = function (req, res, next) {
	if (Array.isArray(req.erm.result)) {
		async.map(req.erm.result, getProjects, function (err, results) {
			next();
		});
	}
	else {
		async.map(req.erm.result.projects, getVersion, function (err, results) {
			next();
		});
	}
};

function getProjects(release, next) {
	async.map(release.projects, getVersion, function (err, results) {
		next(false, results);
	});
}

// function getProject(project, next) {
// 	utils.jira.getJiraClient().project.getProject({ projectIdOrKey: project.projectId },
// 		function (error, jiraProject) {
// 			project.projectDetails = jiraProject;
// 			next(false, project);
// 		});
// }

// function getVersions(project, next) {
// 	console.log('project', project);
// 	utils.jira.getJiraClient().project.getVersions(
// 		{
// 			projectIdOrKey: project.id
// 		},
// 		function (error, versions) {
// 			project.versions = JSON.parse(JSON.stringify(versions));
// 			async.map(project.versions, getIssues, function (err, results) {
// 				next(false, project);
// 			});
// 		});
// }

function getVersion(project, next) {
	utils.jira.getJiraClient().version.getVersion(
		{
			versionId: project.versionId
		},
		function (error, version) {
			project.versionDetails = version;

			let query = {
				jql: 'project = ' + project.projectId + ' & fixVersion = ' + version.name,
				maxResults: 100,
				startAt: 0,
				fields: ['summary', 'description', 'status'],
				fieldsByKeys: false
			};

			utils.jira.getJiraClient().search.search(query, (err, issues) => {
				project.versionDetails.issues = JSON.parse(JSON.stringify(issues));
				next(false, project);
			});
		});
}

// function getIssues(version, next) {
// 	console.log('version', version);
// 	let query = {
// 		jql: 'project = ' + version.id + ' & fixVersion = ' + version.name,
// 		maxResults: 100,
// 		startAt: 0,
// 		fields: ['summary', 'description'],
// 		fieldsByKeys: false
// 	};

// 	utils.jira.getJiraClient().search.search(query, (err, issues) => {
// 		version.issues = JSON.parse(JSON.stringify(issues));
// 		next(false, version);
// 	});
// }

var createVersions = function (req, res, next) {
	var versions = [];

	for (var i = 0; i < req.body.projects.length; i++) {
		var version = {
			name: req.body.name,
			description: req.body.description,
			projectId: req.body.projects[i].projectId,
			startDate: req.body.startDate,
			releaseDate: req.body.releaseDate
		};

		versions.push(version);
	}

	async.map(versions, createVersion, function (err, results) {
		for (var i = 0; i < results.length; i++) {
			req.body.projects[i].versionId = results[i].versionId;
		}
		next();
	});
};

function createVersion(version, next) {
	utils.jira.getJiraClient().version.createVersion({ version: version }, function (error, response) {
		if (error) {
			res.send(error);
		}
		else {
			version.versionId = response.id;
			next(false, version);
		}
	});
}

exports.getReleases = getReleases;
exports.createVersions = createVersions;