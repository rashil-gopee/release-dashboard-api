var config = require('../config/app.config'),
	mailjet = require('node-mailjet').connect(
		config.mail_api_key,
		config.mail_api_secret
	);

module.exports = (function() {
	/**
	 * It sends bulk email to the given distinations
	 * @param {string} fromName Sender
	 * @param {string} to Receiver(s)
	 * @param {string} subject Email title
	 * @param {string} text Email content as a text
	 * @param {string} html Email HTML formmated content
	 * @param {string} cb Callback function
	 */
	var bulkmail = function(fromName, to, subject, text, html, cb) {
		var emailData = {
			fromEmail: config.from_email,
			fromName: fromName,
			Subject: subject,
			'Text-part': text || '',
			'Html-part': html,
			Recipients: to
		};

		console.log('emailData', emailData);

		mailjet
			.post('send')
			.request(emailData)
			.then(function(result) {
				console.log('mail sent result', JSON.stringify(result));
				cb(null, result);
			})
			.catch(function(err) {
				console.log('err', err);
				cb(err);
			});
	};

	return bulkmail;
})();
