const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json');

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
	}],
	checklists: [{
		checklistId: mongoose.Types.ObjectId,
		value: Boolean
	}]
});

releaseSchema = releaseSchema.plugin(sanitizeJson);
module.exports = mongoose.model('Release', releaseSchema);
