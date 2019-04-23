// Importing Node packages required for schema
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	constant = require('../config/app.constant'),
	ROLE_AGENCY_ADMIN = constant.ROLE_AGENCY_ADMIN,
	ROLE_OFFICE_MANAGER = constant.ROLE_OFFICE_MANAGER,
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
			unique: true
		},
		jiraAccountId: {
			type: String,
			unique: true,
			// required: true
		},
		// tokenSecret: {
		// 	type: String,
		// 	required: true,
		// 	select: false
		// },
		authId: {
			type: mongoose.Types.ObjectId,
			required: true
		},
		role: {
			type: String,
			enum: [
				ROLE_AGENCY_ADMIN,
				ROLE_OFFICE_MANAGER,
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
