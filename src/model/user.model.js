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
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true,
			select: false
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
		},
		status: {
			type: String,
			enum: ['Active', 'Deactivated', 'Pending'],
			default: 'Active'
		},
		resetPasswordToken: {
			type: String
		},
		resetPasswordExpires: {
			type: Date
		}
	},
	{ timestamps: true }
);

// = =============================== User ORM Methods =
// =============================== Pre-save of user to database, hash password
// if password is modified or new
UserSchema.pre('save', function(next) {
	var user = this,
		SALT_FACTOR = 5;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) {
			return cb(err);
		}

		cb(null, isMatch);
	});
};

UserSchema.plugin(sanitizeJson);
module.exports = mongoose.model('User', UserSchema);
