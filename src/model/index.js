var mongoose = require('mongoose');

module.exports = {
	user: require('./user.model'),
	permission: require('./permission.model'),
	team: require('./team.model'),
	release: require('./release.model'),
	checklist: require('./checklist.model')
};
