const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json');

var releaseSchema = new Schema({
	releaseDate: {
		type: Date,
		required: true
	},
	startDate: {
		type: Date,
		required: true
	},
	devfinish: {
		type: Date,
		required: true
	},
	regressionDeploy: {
		type: Date,
		required: false
	},
	refreshDate: {
		type: Date,
		required: true
	},
	regressionStart: {
		type: Date,
		required: true
	},
	regressionEnd: {
		type: Date,
		required: true
	},
	cabDate: {
		type: Date,
		required: false
	},
	testenvironment: {
		type: String,
		required: true
	},
	regenvironment: {
		type: String,
		required: true
	},
	biztalk: {
		type: String,
		required: true
	},
	sitecore: {
		type: String,
		required: true
	},
	devsupport: {
		type: String,
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
