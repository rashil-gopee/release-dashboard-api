var mongoose = require('mongoose'),
	restify = require('express-restify-mongoose'),
	passport = require('passport'),
	express = require('express'),
	model = require('../model'),
	controller = require('../controller'),
	middleware = require('../middleware'),
	passportService = middleware.passport,
	constant = require('../config/app.constant'),
	ROLE_SUPER_ADMIN = constant.ROLE_SUPER_ADMIN,
	ROLE_AGENCY_ADMIN = constant.ROLE_AGENCY_ADMIN,
	ROLE_OFFICE_MANAGER = constant.ROLE_OFFICE_MANAGER,
	ROLE_USER = constant.ROLE_USER;

// Middleware to require login/auth
var requireAuth = passport.authenticate('jwt', { session: false }),
	requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app) {
	// Initializing route groups
	var apiRoutes = express.Router(),
		authRoutes = express.Router(),
		userRoutes = express.Router(),
		srcRoutes = express.Router(),
		fileRoutes = express.Router(),
		surveyRoutes = express.Router(),
		projectRoutes = express.Router(),
		permissionRoutes = express.Router();

	// Set url for API group routes
	app.use('/api/v1', apiRoutes);
	//= ========================
	// Auth Routes
	//= ========================

	// Set auth routes as subgroup/middleware to apiRoutes
	apiRoutes.use('/auth', authRoutes);

	apiRoutes.use('/permission', permissionRoutes);

	apiRoutes.use('/project', projectRoutes);

	// Registration route
	authRoutes.post('/register', controller.AuthenticationController.register);

	// authRoutes.get('', controller.AuthenticationController);

	// authRoutes.post('', controller.AuthenticationController);



	// Login route
	// authRoutes.post(
	// 	'/login',
	// 	requireLogin,
	// 	controller.AuthenticationController.login
	// );

	// // Password reset request route (generate/send token)
	// authRoutes.post(
	// 	'/forgot-password',
	// 	controller.AuthenticationController.forgotPassword
	// );

	// // Password reset route (change password using token)
	// authRoutes.post(
	// 	'/reset-password/:token',
	// 	controller.AuthenticationController.verifyToken
	// );


	authRoutes.get('', controller.AuthenticationController.oauthToken);

	authRoutes.post('', controller.AuthenticationController.oauthAccessToken);
	// authRoutes.get('/getJIRA', controller.ReleaseController.getJira);


	// Test protected route
	apiRoutes.get('/protected', requireAuth, (req, res) => {
		res.send({ content: 'The protected test route is functional!' });
	});

	apiRoutes.get(
		'/admins-only',
		requireAuth,
		controller.AuthenticationController.roleAuthorization(ROLE_SUPER_ADMIN),
		(req, res) => {
			res.send({ content: 'Admin dashboard is working.' });
		}
	);

	surveyRoutes.post('/distribute', controller.SurveyController.mailDistribute);

	//= ========================
	// File Routes
	//= ========================	

	apiRoutes.use('/file', fileRoutes);

	fileRoutes.post('/', controller.FileController.postFile);

	fileRoutes.get('/:id', controller.FileController.getFile);

	app.use('', srcRoutes);

	restify.serve(srcRoutes, model.user, {
		postRead: controller.UserController.getUsers
	});

	restify.serve(srcRoutes, model.permission);

	restify.serve(srcRoutes, model.team, {
		postRead: controller.TeamController.getTeams
	});

	restify.serve(srcRoutes, model.release, {
		// preRead: controller.ReleaseController.getRelease,
		preUpdate: controller.ReleaseController.editRelease,
		preCreate: controller.ReleaseController.createVersions,
		postRead: controller.ReleaseController.getReleases,

	});

	// restify.serve(srcRoutes, model.release);

	restify.serve(srcRoutes, model.checklist);

	projectRoutes.get('', controller.ProjectController.getProjects);
};
