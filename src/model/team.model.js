var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json'),
	constant = require('../config/app.constant');

var teamSchema = new Schema({
	jiraProjectId: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true
	}
},
{ timestamps: true });

teamSchema = teamSchema.plugin(sanitizeJson);
module.exports = mongoose.model('Team', teamSchema);
