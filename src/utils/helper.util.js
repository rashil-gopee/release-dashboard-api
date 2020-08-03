var constant = require('../config/app.constant'),
	ROLE_MEMBER = constant.ROLE_MEMBER,
	ROLE_CLIENT = constant.ROLE_CLIENT,
	ROLE_OWNER = constant.ROLE_OWNER,
	ROLE_ADMIN = constant.ROLE_ADMIN;

/**
 * Set user info from request
 */
exports.setUserInfo = function setUserInfo(request) {
	var getUserInfo = {
		_id: request._id,
		// firstName: request.profile.applicants[0].firstName,
		// lastName: request.profile.applicants[0].lastName,
		email: request.email,
		role: request.role
	};

	return getUserInfo;
};

/**
 * Get role mapping number
 */
exports.getRole = function getRole(checkRole) {
	let role;

	switch (checkRole) {
		case ROLE_SUPER_ADMIN:
			role = 4;
			break;
		case ROLE_OFFICE_MANAGER:
			role = 3;
			break;
		case ROLE_AGENGY_ADMIN:
			role = 2;
			break;
		case ROLE_USER:
			role = 1;
			break;
		default:
			role = 1;
	}

	return role;
};
