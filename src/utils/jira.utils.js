var JiraClient = require('jira-connector');
const model = require('../model');
const config = require('../config/app.config');
const jwt = require('jsonwebtoken');
const JIRA = require('../config/app.config').JIRA;

var jiraClient = null;

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

exports.getJiraClient = function () {
	return jiraClient;
};

exports.createJiraClient = function (req, callback) {
	if (jiraClient == null) {
		var authHeader = req.headers['authorization'];
		if (authHeader != null && authHeader.startsWith('Bearer')) {
			var jwtInfo = jwt.decode(authHeader.split(' ')[1].trim(), config.secret);
			model.auth.findOne({ _id: jwtInfo.authId }, function (err, auth) {
				if (err) {
					console.log('err', err);
				}
				jiraClient = new JiraClient({
					host: JIRA.HOST,
					oauth: {
						consumer_key: JIRA.KEY,
						private_key: privateKeyData,
						token: jwtInfo.access_token,
						token_secret: auth.tokenSecret
					}
				});
				callback();
			});
		}
	}
};