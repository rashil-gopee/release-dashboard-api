var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json'),
	constant = require('../config/app.constant');

var authSchema = new Schema({
    jwtToken: {
		type: String,
		required: true
    },
    accesstoken: {
		type: String,
		required: true
    },
    secretToken: {
		type: String,
		required: true
	}
});

authSchema = authSchema.plugin(sanitizeJson);
module.exports = mongoose.model('Auth', authSchema);
