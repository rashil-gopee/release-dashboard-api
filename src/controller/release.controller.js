// const JiraClient = require('jira-connector');

var fs = require('fs'),
	mongoose = require('mongoose'),
	multiparty = require('multiparty'),
	Grid = require('gridfs-stream'),
	config = require('../config/app.config');

const utils = require('../utils');
const async = require('async');
const model = require('../model');

eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);


mongoose.Promise = global.Promise;

var connection = mongoose.createConnection(config.mongodb);

var editRelease = function (req, res, next) {
	// console.log('req', req);

	model.release.findById(req.body._id, (err, release) => {
		console.log('release', release);
		// req.body.checklists.forEach(checklist => {

		// });
		if (req.body.checklists !== undefined && release !== null && release.checklists !== undefined) {

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


		}
	});

	next();
};

var getReleases = function (req, res, next) {
	utils.jira.createJiraClient(req, function () {
		if (Array.isArray(req.erm.result)) {
			async.map(req.erm.result, getProjects, function (err, results) {
				console.log('req.erm.result', req.erm.result);
				next();
			});
		}
		else {
			async.map(req.erm.result.projects, getVersion, function (err, results) {
				// console.log('req.erm.result', req.erm.result);

				async.map(req.erm.result.testResults, loadFileDetails, function (err, results) {
					// console.log('req.erm.result', req.erm.result);


					async.map(req.erm.result.checklists, loadChecklistContactUserDetails, function (err, results) {
						console.log('req.erm.result', req.erm.result);

						model.user.findById(req.erm.result.deploymentChampion, function (err, user) {
							utils.jira.getJiraClient().user.getUser({ username: user.jiraUsername }, function (error, response) {
								req.erm.result.deploymentChampionUserDetails = response;

								model.user.findById(req.erm.result.devSupport, function (err, user) {
									utils.jira.getJiraClient().user.getUser({ username: user.jiraUsername }, function (error, response) {
										req.erm.result.devSupportUserDetails = response;
										// return next(false, checklist);
										next();
									});
								});
								// return next(false, checklist);
							});
						});

						// next();
					});

					// next();
				});

				// next();
			});
		}
	});
};

function loadChecklistContactUserDetails(checklist, next) {
	model.user.findById(checklist.contactPerson, function (err, user) {
		utils.jira.getJiraClient().user.getUser({ username: user.jiraUsername }, function (error, response) {
			checklist.contactPersonUserDetails = response;
			return next(false, checklist);
		});
	});
}

// function loadUserDetails(userId) {
// 	model.user.findById(userId, function (err, user) {
// 		console.log('user', user);
// 		return user;
// 	});
// }

function loadFileDetails(testResult, next) {
	var gfs = Grid(connection.db, mongoose.mongo);
	gfs.findOne({
		_id: testResult.fileId
	}, function (err, file) {
		for (var property in file) {
			if (file.hasOwnProperty(property)) {
				testResult[property] = file[property];
			}
		}
		next(false, testResult);
	});
}

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
