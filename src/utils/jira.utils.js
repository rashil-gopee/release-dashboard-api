var JiraClient = require('jira-connector');
const model = require('../model');
const key = 'test';
const host = 'releasedashboard.atlassian.net';
const privateKeyData = '-----BEGIN RSA PRIVATE KEY-----\n' +
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
const config = require('../config/app.config');


var jiraClient = null;
exports.getJiraClient = function (req, res, next) {
	if (jiraClient != null) {
		var authHeader = req.headers['authorization'];
		// console.log('authHeader', authHeader);
		if (authHeader != null && authHeader.startsWith('Bearer')) {
			var jwtInfo = jwt.decode(authHeader.split(' ')[1], config.secret);
			console.log('jwtInfo', jwtInfo);
			model.auth.findOne(jwtInfo.authId, function (err, auth) {
				if (err)
					res.status(401).send(err);

				jira = new JiraClient({
					host: host,
					oauth: {
						consumer_key: key,
						private_key: privateKeyData,
						token: jwtInfo.access_token,
						token_secret: auth.tokenSecret
					}
				});
			});
		}
	}
	return jiraClient;
};

// var jira = null;

// var getJiraClient = function () {
// 	if (jira == null) {
// 		jira = new JiraClient({
// 			host: 'releasedashboard.atlassian.net',
// 			basic_auth: {
// 				username: 'rashillgopee@gmail.com',
// 				password: 'Hy2c6Ja9GaBaZs8'
// 			}
// 		});

// 		// jira.version.ge
// 	}
// 	return jira;
// };



// exports.getJiraClient = getJiraClient;