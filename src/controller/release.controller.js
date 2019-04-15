var fs = require('fs'),
	mongoose = require('mongoose'),
	multiparty = require('multiparty'),
	Grid = require('gridfs-stream'),
	config = require('../config/app.config');

mongoose.Promise = global.Promise;

 var JiraClient = require('jira-connector');

// var getRelease = function(req, res, next) {
// 	var jira = new JiraClient({
// 		host: 'releasedashboard.atlassian.net',
// 		basic_auth: {
// 			username: 'rashillgopee@gmail.com',
// 			password: 'Hy2c6Ja9GaBaZs8'
// 		}
// 	});

JiraClient.oauth_util.getAuthorizeURL({
    host: 'releasedashboard.atlassian.net',
    oauth: {
        consumer_key: 'test',
        private_key: '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIICXgIBAAKBgQC3rfhjnIsE9aryEJtiu9qr8LVAlzKkydf9qiScqTR2kQsCnnCz\n'+
		'W9Fqk5d2eyGU9R5ybqhyd8tlPFhh0eefRJIA1Z8IfMricsNRxD8ta7ytptWg2MVW\n'+
		'BIj2xXepV9b+js84kCPbn12LFYdB2lOgitgO8t5Mn4zb/anrkzklEjsUQwIDAQAB\n'+
		'AoGAJAAgF/39rWotKCajHfXtxRd3nwJDddLt15T6eg4b70U8YDYHps/POtFUtW8q\n'+
		'xNRKNGmF8HGUVvI97GZEvI2nA9fZOR6B3CbAaQ8Lut/do2vG0pL/wCtiknLm4x5Z\n'+
		'9wZduu1QSstGOsEvmxZGavGGl6MA3sUxs88E4lyxUqInqcECQQDaqp2aVGoIt2Pq\n'+
		'5P+KIkilduXcBi8IafReOOtLVaCTBfRr2HdMcCeRXkAJoeNWKqFL+mP8PRF53hGX\n'+
		'TCzY5r5hAkEA1wopZnWKW+KZI0G09FjRwTXyYEpMurx1jIwXDRoAw7+DvMEOWtbJ\n'+
		'oQL0lYg9mHS5dBlEA/FIhHXJVMJ49jgtIwJBAMCCDqhNAuDTm3qzyqlwz2Yky+6t\n'+
		'3wBYT5QYJkY3h1uIlYvQkg7QenVHdbdFN+CnPUOnmBj8JoOU1wXNQXpfgmECQQDI\n'+
		'pSSoA3iL78zvxrlvXQiqfQmgqvMZMguEjppbkS2xeBsVnhUk0VDlOXq5o5vFivQX\n'+
		'zhNWkmYVokmvGp3/L799AkEAlsvXgKJqZ4qENDa9yH1QhOPMhx+bABZtLv6E8J9O\n'+
		'y3EUMWMNSV7tBa3mV8p30OD52BC7uS/oFznq5OgyLX9aeg==\n' +
        '-----END RSA PRIVATE KEY-----'
    }
}, function (error, oauth) {
	console.log(oauth)
	console.log(oauth.token);
	console.log(oauth.token_secret);
});


JiraClient.oauth_util.swapRequestTokenWithAccessToken({
    host: 'releasedashboard.atlassian.net',
    oauth: {
        token: 'JWUg1XXQquvY413C9EpERx4t6ykED5v6',
        token_secret: 'h9Bb90lXNTI8MgCE28olLTqwpzufYiR4',
        oauth_verifier: 'dPq4CQ',
        consumer_key: 'test',
        private_key: '-----BEGIN RSA PRIVATE KEY-----\n' +
		'MIICXgIBAAKBgQC3rfhjnIsE9aryEJtiu9qr8LVAlzKkydf9qiScqTR2kQsCnnCz\n'+
		'W9Fqk5d2eyGU9R5ybqhyd8tlPFhh0eefRJIA1Z8IfMricsNRxD8ta7ytptWg2MVW\n'+
		'BIj2xXepV9b+js84kCPbn12LFYdB2lOgitgO8t5Mn4zb/anrkzklEjsUQwIDAQAB\n'+
		'AoGAJAAgF/39rWotKCajHfXtxRd3nwJDddLt15T6eg4b70U8YDYHps/POtFUtW8q\n'+
		'xNRKNGmF8HGUVvI97GZEvI2nA9fZOR6B3CbAaQ8Lut/do2vG0pL/wCtiknLm4x5Z\n'+
		'9wZduu1QSstGOsEvmxZGavGGl6MA3sUxs88E4lyxUqInqcECQQDaqp2aVGoIt2Pq\n'+
		'5P+KIkilduXcBi8IafReOOtLVaCTBfRr2HdMcCeRXkAJoeNWKqFL+mP8PRF53hGX\n'+
		'TCzY5r5hAkEA1wopZnWKW+KZI0G09FjRwTXyYEpMurx1jIwXDRoAw7+DvMEOWtbJ\n'+
		'oQL0lYg9mHS5dBlEA/FIhHXJVMJ49jgtIwJBAMCCDqhNAuDTm3qzyqlwz2Yky+6t\n'+
		'3wBYT5QYJkY3h1uIlYvQkg7QenVHdbdFN+CnPUOnmBj8JoOU1wXNQXpfgmECQQDI\n'+
		'pSSoA3iL78zvxrlvXQiqfQmgqvMZMguEjppbkS2xeBsVnhUk0VDlOXq5o5vFivQX\n'+
		'zhNWkmYVokmvGp3/L799AkEAlsvXgKJqZ4qENDa9yH1QhOPMhx+bABZtLv6E8J9O\n'+
		'y3EUMWMNSV7tBa3mV8p30OD52BC7uS/oFznq5OgyLX9aeg==\n' +
        '-----END RSA PRIVATE KEY-----'
    }
}, function (error, accessToken) {
    console.log(accessToken);
});


var jira = new JiraClient({
    host: 'releasedashboard.atlassian.net',
    oauth: {
        consumer_key: 'test',
        private_key: '-----BEGIN RSA PRIVATE KEY-----\n' +
		'MIICXgIBAAKBgQC3rfhjnIsE9aryEJtiu9qr8LVAlzKkydf9qiScqTR2kQsCnnCz\n'+
		'W9Fqk5d2eyGU9R5ybqhyd8tlPFhh0eefRJIA1Z8IfMricsNRxD8ta7ytptWg2MVW\n'+
		'BIj2xXepV9b+js84kCPbn12LFYdB2lOgitgO8t5Mn4zb/anrkzklEjsUQwIDAQAB\n'+
		'AoGAJAAgF/39rWotKCajHfXtxRd3nwJDddLt15T6eg4b70U8YDYHps/POtFUtW8q\n'+
		'xNRKNGmF8HGUVvI97GZEvI2nA9fZOR6B3CbAaQ8Lut/do2vG0pL/wCtiknLm4x5Z\n'+
		'9wZduu1QSstGOsEvmxZGavGGl6MA3sUxs88E4lyxUqInqcECQQDaqp2aVGoIt2Pq\n'+
		'5P+KIkilduXcBi8IafReOOtLVaCTBfRr2HdMcCeRXkAJoeNWKqFL+mP8PRF53hGX\n'+
		'TCzY5r5hAkEA1wopZnWKW+KZI0G09FjRwTXyYEpMurx1jIwXDRoAw7+DvMEOWtbJ\n'+
		'oQL0lYg9mHS5dBlEA/FIhHXJVMJ49jgtIwJBAMCCDqhNAuDTm3qzyqlwz2Yky+6t\n'+
		'3wBYT5QYJkY3h1uIlYvQkg7QenVHdbdFN+CnPUOnmBj8JoOU1wXNQXpfgmECQQDI\n'+
		'pSSoA3iL78zvxrlvXQiqfQmgqvMZMguEjppbkS2xeBsVnhUk0VDlOXq5o5vFivQX\n'+
		'zhNWkmYVokmvGp3/L799AkEAlsvXgKJqZ4qENDa9yH1QhOPMhx+bABZtLv6E8J9O\n'+
		'y3EUMWMNSV7tBa3mV8p30OD52BC7uS/oFznq5OgyLX9aeg==\n' +
        '-----END RSA PRIVATE KEY-----',
        token: 'xM9dYuaqzy0p8jY7U55t0ngUDgAqa7kq',
        token_secret: 'ly0agpnXXWqwWMXqTwxutb3dIK2lbmNi'
    }
});


	jira.issue.getIssue(
		{
			issueKey: 'RD-11'
		},
		function(error, issue) {
			console.log('error', error);
			console.log('issue', issue.fields.fixVersions);
		}
	);

	jira.issue.getIssuePicker(
		{
			query: 'version=AprilOOCR'
		},
		function(error, issue) {
			console.log('error', error);
			console.log('issue', issue);
		}
	);

	// let query = {
	// 	jql: 'project = 10001 & fixVersion = AprilOOCR',
	// 	maxResults: 100,
	// 	startAt: 0,
	// 	fields: ['summary', 'description'],
	// 	fieldsByKeys: false
	// };

	// jira.search.search(query, (err, issues) => {
	// 	console.log(issues);
	// });

	// jira.project.getAllProjects({}, function(error, projects) {
	// 	console.log('error', error);
	// 	console.log('projects', projects);
	// 	projects.forEach(project => {
	// 		console.log('Project Id', project.id);
	// 		jira.project.getVersions({ projectIdOrKey: project.id }, function(
	// 			error,
	// 			versions
	// 		) {
	// 			console.log('error', error);
	// 			console.log('versions', versions);
	// 			versions.forEach(version => {
	// 				jira.version.getUnresolvedIssueCount(
	// 					{ versionId: version.id },
	// 					function(error, issues) {
	// 						console.log('issues', issues);
	// 					}
	// 				);
	// 			});
	// 		});
	// 	});
	// 	next();
	// });


//exports.getRelease = getRelease;
