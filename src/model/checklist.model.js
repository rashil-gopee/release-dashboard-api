var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json'),
	constant = require('../config/app.constant');

var checklistSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	contactPerson: {
		type: mongoose.Types.ObjectId,
		required: true
	}
});

checklistSchema = checklistSchema.plugin(sanitizeJson);
module.exports = mongoose.model('Checklist', checklistSchema);
