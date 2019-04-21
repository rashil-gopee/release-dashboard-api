var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json'),
	constant = require('../config/app.constant');

var authSchema = new Schema({
	oauthToken: {
		type: String,
		required: true,
		unique: true
	},
	tokenSecret: {
		type: String,
		required: true,
		unique: true
	}
});

authSchema = authSchema.plugin(sanitizeJson);
module.exports = mongoose.model('Auth', authSchema);
