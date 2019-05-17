// const JiraClient = require('jira-connector');

const utils = require('../utils');
const async = require('async');
const model = require('../model');

var editRelease = function (req, res, next) {
	// console.log('req', req);

	model.release.findById(req.body._id, (err, release) => {
		console.log('release', release);
		// req.body.checklists.forEach(checklist => {

		// });
		for (var i = 0; i < req.body.checklists.length; i++) {
			if (req.body.checklists[i].value != release.checklists[i].value) {

				console.log('req.body.checklists[i].contactPerson', req.body.checklists[i].contactPerson);
				model.user.findById(req.body.checklists[i].contactPerson, (err, user) => {
					// console.log('user', user);
					utils.jira.createJiraClient(req, function () {
						utils.jira.getJiraClient().user.getUser({ username: user.jiraUsername }, function (error, response) {
							console.log('response', response);

							var subject = 'Reset Password';
							var html =
								'Checlist has been checked | unchecked.\n\n';

							utils.sendmail(response.emailAddress, subject, null, html, function (err, sent) {
								if (err) return res.sendStatus(400);
							});
							// utils.sendmail()
							// next();
						});
					});
				});

				// utils.jira.createJiraClient(req, function () {
				// 	utils.jira.getJiraClient().user.getUser({ username: req.erm.result.jiraUsername }, function (error, response) {
				// 		for (var k in response) {
				// 			req.erm.result[k] = response[k];
				// 		}
				// 		next();
				// 	});
				// });

			}
		}
	});

	next();
};

var getReleases = function (req, res, next) {
	utils.jira.createJiraClient(req, function () {
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
	});
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
	utils.jira.createJiraClient(req, function () {
		var versions = [];

		for (let i = 0; i < req.body.projects.length; i++) {
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
	});
};

function createVersion(version, next) {
	utils.jira.getJiraClient().version.createVersion({ version: version }, function (error, response) {
		if (error) {
			console.log('error', error);
			// res.send(error);
		}
		else {
			version.versionId = response.id;
			next(false, version);
		}
	});
}

exports.getReleases = getReleases;
exports.createVersions = createVersions;
exports.editRelease = editRelease;
