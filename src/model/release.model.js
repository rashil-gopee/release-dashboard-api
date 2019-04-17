var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json'),
	constant = require('../config/app.constant');

var releaseSchema = new Schema({
	releaseDate: {
		type: Date,
		required: true
	},
	projects: [{
		projectId: {
			type: String,
			required: true
		}, versionId: {
			type: String
		}
	}]
});

releaseSchema = releaseSchema.plugin(sanitizeJson);
module.exports = mongoose.model('Release', releaseSchema);
