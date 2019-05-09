const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json');

var releaseSchema = new Schema({
	releaseDate: {
		type: Date,
		required: true
	},
	releaseType: {
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
		value: Boolean,
		dueDate: {
			type: Date,
			required: true
		}
	}],
	devFinishDate: {
		type: Date,
		required: true
	},
	regressionDeployDate: {
		type: Date,
		required: false
	},
	refreshDate: {
		type: Date,
		required: true
	},
	regressionStartDate: {
		type: Date,
		required: true
	},
	regressionEndDate: {
		type: Date,
		required: true
	},
	cabDate: {
		type: Date,
		required: false
	},
	testEnvironment: {
		type: String,
		required: true
	},
	regEnvironment: {
		type: String,
		required: true
	},
	biztalk: {
		type: String,
		required: true
	},
	deploymentChampion: {
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		}
	},
	sitecore: {
		type: String,
		required: true
	},
	devSupport: {
		type: String,
		required: true
	},
	testResultsFileId: { type: Schema.Types.ObjectId }
});

releaseSchema = releaseSchema.plugin(sanitizeJson);
module.exports = mongoose.model('Release', releaseSchema);
