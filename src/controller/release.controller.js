var JiraClient = require('jira-connector');
const utils = require('../utils');
const async = require('async');

const key = 'test';
const host = 'releasedashboard.atlassian.net';
let privateKeyData = '-----BEGIN RSA PRIVATE KEY-----\n' +
	'MIICXgIBAAKBgQC3rfhjnIsE9aryEJtiu9qr8LVAlzKkydf9qiScqTR2kQsCnnCz\n' +
	'W9Fqk5d2eyGU9R5ybqhyd8tlPFhh0eefRJIA1Z8IfMricsNRxD8ta7ytptWg2MVW\n' +
	'BIj2xXepV9b+js84kCPbn12LFYdB2lOgitgO8t5Mn4zb/anrkzklEjsUQwIDAQAB\n' +
	'AoGAJAAgF/39rWotKCajHfXtxRd3nwJDddLt15T6eg4b70U8YDYHps/POtFUtW8q\n' +
	'xNRKNGmF8HGUVvI97GZEvI2nA9fZOR6B3CbAaQ8Lut/do2vG0pL/wCtiknLm4x5Z\n' +
	'9wZduu1QSstGOsEvmxZGavGGl6MA3sUxs88E4lyxUqInqcECQQDaqp2aVGoIt2Pq\n' +
	'5P+KIkilduXcBi8IafReOOtLVaCTBfRr2HdMcCeRXkAJoeNWKqFL+mP8PRF53hGX\n' +
	'TCzY5r5hAkEA1wopZnWKW+KZI0G09FjRwTXyYEpMurx1jIwXDRoAw7+DvMEOWtbJ\n' +
	'oQL0lYg9mHS5dBlEA/FIhHXJVMJ49jgtIwJBAMCCDqhNAuDTm3qzyqlwz2Yky+6t\n' +
	'3wBYT5QYJkY3h1uIlYvQkg7QenVHdbdFN+CnPUOnmBj8JoOU1wXNQXpfgmECQQDI\n' +
	'pSSoA3iL78zvxrlvXQiqfQmgqvMZMguEjppbkS2xeBsVnhUk0VDlOXq5o5vFivQX\n' +
	'zhNWkmYVokmvGp3/L799AkEAlsvXgKJqZ4qENDa9yH1QhOPMhx+bABZtLv6E8J9O\n' +
	'y3EUMWMNSV7tBa3mV8p30OD52BC7uS/oFznq5OgyLX9aeg==\n' +
	'-----END RSA PRIVATE KEY-----';

exports.getJira = function (req, res, next) {
	const jwtToken = req.body.jwtToken;
	model.auth.findOne({ jwtToken: jwtToken }, (err, token) => {
		if (err) {
			console.log(err);
			return next(err);
		}

		// If user is not unique, return error
		if (token) {
			var token_secret = token.secretToken;
			var access_token = jwt.decode(jwtToken, token_secret);

			var jira = new JiraClient({
				host: host,
				oauth: {
					consumer_key: key,
					private_key: privateKeyData,
					token: access_token,
					token_secret: token_secret
				}
			});
			jira.issue.getIssue(
				{
					issueKey: 'RD-11'
				},
				function (error, issue) {
					console.log('error', error);
					console.log('issue', issue.fields.fixVersions);
				}
			);
		} else next();
	});
};

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
