// Importing Node packages required for schema
var mongoose = require('mongoose'),
	constant = require('../config/app.constant'),
	ROLE_SUPER_ADMIN = constant.ROLE_SUPER_ADMIN,
	ROLE_USER = constant.ROLE_USER,
	sanitizeJson = require('mongoose-sanitize-json'),
	Schema = mongoose.Schema;

// = =============================== User Schema =
// ===============================

var UserSchema = new Schema(
	{
		jiraUsername: {
			type: String,
			unique: true,
			required: true
		},
		authId: {
			type: mongoose.Types.ObjectId,
			required: true,
			unique: true
		},
		role: {
			type: String,
			enum: [
				ROLE_SUPER_ADMIN,
				ROLE_USER
			],
			default: ROLE_USER
		}
	},
	{ timestamps: true }
);

UserSchema.plugin(sanitizeJson);
module.exports = mongoose.model('User', UserSchema);
