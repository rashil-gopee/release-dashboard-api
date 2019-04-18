var JiraClient = require('jira-connector');

var jira = null;

var getJiraClient = function () {
	if (jira == null) {
		jira = new JiraClient({
			host: 'releasedashboard.atlassian.net',
			basic_auth: {
				username: 'rashillgopee@gmail.com',
				password: 'Hy2c6Ja9GaBaZs8'
			}
		});

		// jira.version.ge
	}
	return jira;
};

exports.getJiraClient = getJiraClient;