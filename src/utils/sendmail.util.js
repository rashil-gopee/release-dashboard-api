var config = require('../config/app.config'),
	mailjet = require('node-mailjet').connect(
		config.mail_api_key,
		config.mail_api_secret
	);

module.exports = (function() {
	/**
	 * It sends an email to the given distination
	 * @param {string} fromName Sender
	 * @param {string} to Receiver
	 * @param {string} subject Email title
	 * @param {string} text Email content as a text
	 * @param {string} html Email HTML formmated content
	 * @param {string} cb Callback function
	 */
	var sendmail = function(to, subject, text, html, cb) {
		var emailData = {
			fromEmail: config.from_email,
			fromName: config.from_name,
			Subject: subject,
			'Text-part': text || '',
			'Html-part': html,
			Recipients: [
				{
					Email: to
				}
			]
		};

		mailjet
			.post('send')
			.request(emailData)
			.then(function(result) {
				console.log('mail sent result', JSON.stringify(result));
				cb(null, result);
			})
			.catch(function(err) {
				cb(err);
			});
	};

	return sendmail;
})();
