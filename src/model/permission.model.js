var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizeJson = require('mongoose-sanitize-json'),
	constant = require('../config/app.constant'),
	ROLE_AGENCY_ADMIN = constant.ROLE_AGENCY_ADMIN,
	ROLE_OFFICE_MANAGER = constant.ROLE_OFFICE_MANAGER,
	ROLE_SUPER_ADMIN = constant.ROLE_SUPER_ADMIN,
	ROLE_USER = constant.ROLE_USER;

// Permission schema as monogdb interface, this is used to map the users to either SuperAdmin or User
var permissionSchema = new Schema({
	subject: {
		type: String,
		required: true
	},
	action: {
		type: String,
		required: true
	},
	allowedRoles: [
		{
			type: String,
			required: true,
			enum: [
				ROLE_AGENCY_ADMIN,
				ROLE_OFFICE_MANAGER,
				ROLE_SUPER_ADMIN,
				ROLE_USER
			]
		}
	]
});

permissionSchema = permissionSchema.plugin(sanitizeJson);
module.exports = mongoose.model('Permission', permissionSchema);
