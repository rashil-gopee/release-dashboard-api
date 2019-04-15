var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json'),
	constant = require('../config/app.constant');

var teamSchema = new Schema({
	name: {
		type: String,
		required: true
	}
});

teamSchema = teamSchema.plugin(sanitizeJson);
module.exports = mongoose.model('Team', teamSchema);
