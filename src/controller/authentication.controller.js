var jwt = require('jsonwebtoken'),
	crypto = require('crypto'),
	model = require('../model'),
	User = model.user,
	utils = require('../utils'),
	sendmail = utils.sendmail,
	// const mailchimp = require('../config/mailchimp');
	helper = utils.helper,
	setUserInfo = helper.setUserInfo,
	getRole = helper.getRole,
	config = require('../config/app.config');

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
var JiraClient = require('jira-connector');
const OAuth = require('oauth').OAuth;
const key = 'test';
const jiraurl = 'https://releasedashboard.atlassian.net';
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
var REQUEST_TOKEN_URL = jiraurl + '/plugins/servlet/oauth/request-token';
var ACCESS_TOKEN_URL = jiraurl + '/plugins/servlet/oauth/access-token';
var AUTHORIZE_TOKEN_URL = jiraurl + '/plugins/servlet/oauth/authorize?oauth_token=';
var OAUTH_VERSION = '1.0';
var HASH_VERSION = 'RSA-SHA1';

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
				console.log(err);
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
// Forgot Password Route
//= =======================================

exports.forgotPassword = function (req, res, next) {
	console.log('req.body', JSON.stringify(req.body));
	const email = req.body.email;

	User.findOne({ email }, (err, existingUser) => {
		// If user is not found, return error
		if (err || existingUser == null) {
			res.status(422).json({
				error:
					'Your request could not be processed as entered. Please try again.'
			});
			return next(err);
		}

		// If user is found, generate and save resetToken

		// Generate a token with Crypto
		crypto.randomBytes(48, (err, buffer) => {
			const resetToken = buffer.toString('hex');
			if (err) {
				return next(err);
			}

			existingUser.resetPasswordToken = resetToken;
			existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

			existingUser.save(err => {
				// If error in saving token, return it
				if (err) {
					return next(err);
				}

				var subject = 'Reset Password';
				var html =
					'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n';
				html +=
					'Please click on the following link, or paste this into your browser to complete the process:\n\n';
				html +=
					'http://localhost:4200/reset-password?token=' +
					resetToken +
					'\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n';

				sendmail(existingUser.email, subject, null, html, function (err, sent) {
					if (err) return res.sendStatus(400);
					else
						return res.status(200).json({
							message:
								'Please check your email for the link to reset your password.'
						});
				});
			});
		});
	});
};

//= =======================================
// Reset Password Route
//= =======================================

exports.verifyToken = function (req, res, next) {
	console.log('req.params', req.params);
	User.findOne(
		{
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() }
		},
		(err, resetUser) => {
			// If query returned no results, token expired or was invalid. Return error.
			if (!resetUser) {
				return res.status(422).json({
					error:
						'Your token has expired. Please attempt to reset your password again.'
				});
			}

			// Otherwise, save new password and clear resetToken from database
			resetUser.password = req.body.password;
			resetUser.resetPasswordToken = undefined;
			resetUser.resetPasswordExpires = undefined;

			resetUser.save(err => {
				if (err) {
					return next(err);
				}

				// If password change saved successfully, alert user via email

				var subject = 'Password Changed';
				var html =
					'You are receiving this email because you changed your password. \n\n' +
					'If you did not request this change, please contact us immediately.';

				// Otherwise, send user email confirmation of password change via Mailgun
				// mailgun.sendEmail(resetUser.email, message);
				sendmail(resetUser.email, subject, null, html, function (err, sent) {
					if (err) return res.sendStatus(400);
					else
						return res.status(200).json({
							message:
								'Password changed successfully. Please login with your new password.'
						});
				});
			});
		}
	).select('+password');




};

//= =======================================
// OAUth Get Route
//= =======================================
exports.oauthToken = function (req, res, next) {

	let consumer = new OAuth(REQUEST_TOKEN_URL,
		ACCESS_TOKEN_URL,
		key,
		privateKeyData,
		OAUTH_VERSION,
		'http://localhost:8080/sessions/callback',
		HASH_VERSION,
		null,
		'');

	consumer.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
		if (error) {
			throw new Error(([error.statusCode, error.data].join(': ')).bold.red);
		} else {
			console.log('Visit:'.bold.green);
			console.log((AUTHORIZE_TOKEN_URL + oauth_token));
			console.log(oauth_token);
			console.log(oauth_token_secret);
			res.status(200).json({
				url: AUTHORIZE_TOKEN_URL + oauth_token,
				token_secret: oauth_token_secret
			});
		}
	});
};


//= =======================================
// OAUth Post Route
//= =======================================

exports.oauthAccessToken = function (req, res, next) {
	const token = req.body.token;
	const token_secret = req.body.tokenSecret;
	const oauth_verifier = req.body.oauthVerifier;
	JiraClient.oauth_util.swapRequestTokenWithAccessToken({
		host: host,
		oauth: {
			token: token,
			token_secret: token_secret,
			oauth_verifier: oauth_verifier,
			consumer_key: key,
			private_key: privateKeyData
		}
	}, function (error, accessToken) {
		if (accessToken) {
			var token = jwt.sign(accessToken, token_secret);
			model.auth.create({ jwtToken: token, accesstoken: accessToken, secretToken: token_secret }, (err, response) => {
				if (err) {
					return next(err);
				}
				if (response) {
					res.status(200).json({
						token: token
					});
				}
				next();
			});
		}
	});
};
