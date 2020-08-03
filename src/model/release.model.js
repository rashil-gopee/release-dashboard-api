const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json');

// Release schema as monogdb interface
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
		value: {
			type: Boolean,
			default: false
		},
		dueDate: {
			type: Date,
			required: true
		},
		contactPerson: {
			type: mongoose.Types.ObjectId,
			required: true
		}
	}],
	devFinishDate: {
		type: Date,
		required: true
	},
	regressionDeployDate: {
		type: Date
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
		type: mongoose.Types.ObjectId,
		required: true
	},
	sitecore: {
		type: String,
		required: true
	},
	devSupport: {
		type: mongoose.Types.ObjectId,
		required: true
	},
	versioning: {
		sitecore: {
			type: String
		},
		SPA: {
			type: String
		},
		biztalkWCF: {
			type: String
		}
	},
	testResults: [{
		fileId: {
			type: Schema.Types.ObjectId
		}
	}],
	tips: [{
		fileId: {
			type: Schema.Types.ObjectId
		}
	}]
},
	{ timestamps: true });

releaseSchema = releaseSchema.plugin(sanitizeJson);
module.exports = mongoose.model('Release', releaseSchema);
