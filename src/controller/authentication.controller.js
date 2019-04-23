var jwt = require('jsonwebtoken'),
	model = require('../model'),
	User = model.user,
	utils = require('../utils'),
	helper = utils.helper,
	setUserInfo = helper.setUserInfo,
	getRole = helper.getRole,
	config = require('../config/app.config');
var JiraClient = require('jira-connector');
const OAuth = require('oauth').OAuth;
const constant = require('../config/app.constant');
const ROLE_SUPER_ADMIN = constant.ROLE_SUPER_ADMIN;
const JIRA = require('../config/app.config').JIRA;


// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: 604800 // in seconds
	});
}

//= =======================================
// Constant Variables
//= =======================================


const jiraurl = 'https://' + JIRA.HOST;

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

var REQUEST_TOKEN_URL = jiraurl + '/plugins/servlet/oauth/request-token';
var ACCESS_TOKEN_URL = jiraurl + '/plugins/servlet/oauth/access-token';
var AUTHORIZE_TOKEN_URL = jiraurl + '/plugins/servlet/oauth/authorize?oauth_token=';
// var OAUTH_VERSION = '1.0';
// var HASH_VERSION = 'RSA-SHA1';

//= =======================================
// Login Route
//= =======================================
exports.login = function (req, res, next) {
	const userInfo = setUserInfo(req.user);

	res.status(200).json({
		token: `JWT ${generateToken(userInfo)}`,
		user: userInfo
	});
};

//= =======================================
// Registration Route
//= =======================================
exports.register = function (req, res, next) {
	// Check for registration errors
	const email = req.body.email;
	const password = req.body.password;

	// Return error if no email provided
	if (!email) {
		return res.status(422).send({ error: 'You must enter an email address.' });
	}

	// Return error if no password provided
	if (!password) {
		return res.status(422).send({ error: 'You must enter a password.' });
	}

	// console.log('User', User.schema.paths);

	User.findOne({ email }, (err, existingUser) => {
		if (err) {
			return next(err);
		}

		// If user is not unique, return error
		if (existingUser) {
			return res
				.status(422)
				.send({ error: 'That email address is already in use.' });
		}

		// If email is unique and password was provided, create account
		const user = new User({
			email: email,
			password: password
		});

		user.save((err, user) => {
			if (err) {
				return next(err);
			}

			// Subscribe member to Mailchimp list
			// mailchimp.subscribeToNewsletter(user.email);

			// Respond with JWT if user was created

			const userInfo = setUserInfo(user);

			res.status(201).json({
				token: `JWT ${generateToken(userInfo)}`,
				user: userInfo
			});
		});
	});
};

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
exports.roleAuthorization = function (requiredRole) {
	return function (req, res, next) {
		const user = req.user;

		User.findById(user._id, (err, foundUser) => {
			if (err) {
				res.status(422).json({ error: 'No user was found.' });
				return next(err);
			}

			// If user is found, check role.
			if (getRole(foundUser.role) >= getRole(requiredRole)) {
				return next();
			}

			return res
				.status(401)
				.json({ error: 'You are not authorized to view this content.' });
		});
	};
};

//= =======================================
// OAUth Get Route
//= =======================================
exports.oauthToken = function (req, res, next) {

	let consumer = new OAuth(REQUEST_TOKEN_URL,
		ACCESS_TOKEN_URL,
		JIRA.KEY,
		privateKeyData,
		JIRA.OAUTH_VERSION,
		'http://localhost:8080/sessions/callback',
		JIRA.HASH_VERSION,
		null,
		'');

	consumer.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
		if (error) {
			throw new Error(([error.statusCode, error.data].join(': ')).bold.red);
		} else {
			model.auth.create({ oauthToken: oauth_token, tokenSecret: oauth_token_secret }, function (err, auth) {
				if (auth) {
					res.status(200).json({
						url: AUTHORIZE_TOKEN_URL + oauth_token,
						// token_secret: oauth_token_secret
					});
				}
				else res.status(401).send(err);
			});

		}
	});
};


//= =======================================
// OAUth Post Route
//= =======================================

exports.oauthAccessToken = function (req, res, next) {
	const oauth_token = req.body.oauth_token;
	// const token_secret = req.body.token_secret;
	const oauth_verifier = req.body.oauth_verifier;

	model.auth.findOne({ oauthToken: oauth_token }, function (err, auth) {
		if (auth) {
			JiraClient.oauth_util.swapRequestTokenWithAccessToken({
				host: JIRA.HOST,
				oauth: {
					token: oauth_token,
					token_secret: auth.tokenSecret,
					oauth_verifier: oauth_verifier,
					consumer_key: JIRA.KEY,
					private_key: privateKeyData
				}
			}, function (error, access_token) {
				if (access_token) {
					var jira = new JiraClient({
						host: JIRA.HOST,
						oauth: {
							consumer_key: JIRA.KEY,
							private_key: privateKeyData,
							token: access_token,
							token_secret: auth.tokenSecret
						}
					});

					jira.myself.getMyself(
						{
						},
						function (error, myself) {
							const user = {
								jiraAccountId: myself.accountId,
								authId: auth._id
							};

							model.user.countDocuments({ role: ROLE_SUPER_ADMIN }, function (err, count) {
								if (count < 1) {
									user.role = ROLE_SUPER_ADMIN;
								}

								var query = { jiraAccountId: user.jiraAccountId },
									options = { upsert: true, new: true, setDefaultsOnInsert: true };

								try {
									model.user.findOneAndUpdate(query, user, options, function (error, result) {
										if (error) res.status(400).send(error);

										var jwtInfo = {
											authId: auth._id,
											access_token: access_token
										};

										for (var k in myself) {
											if (k != 'accountId')
												user[k] = myself[k];
										}

										res.status(200).json({
											token: `Bearer ${jwt.sign(jwtInfo, config.secret)}`,
											user: user
										});
									});
								} catch (e) { console.log(e); }
							});
						}
					);

				}
				else {
					res.status(401).send(error);
				}
			});
		}
		else {
			model.auth.deleteOne({ oauthToken: oauth_token }, function (err, deletedAuth) {
				res.status(401).send(err);
			});
		}
	});
};
