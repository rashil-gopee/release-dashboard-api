var mongoose = require('mongoose'),
	express = require('express'),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	config = require('./config/app.config'),
	router = require('./config/app.router'),
	middleware = require('./middleware'),
	model = require('./model'),
	methodOverride = require('method-override'),
	app = express();

var JiraClient = require('jira-connector');

// Database Setup

// Using `mongoose.connect`...
var promise = mongoose.connect(config.mongodb, {
	useNewUrlParser: true
	/* other options */
});

promise
	.then(function(db) {
		insertDefaultUser();

		app.use(bodyParser.json()); // Send JSON responses
		app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies

		app.use(methodOverride());

		app.use(logger('dev')); // Log requests to API using morgan

		// Enable CORS from client-side
		app.use(middleware.enableCors);

		router(app);

		app.listen(config.port, function() {
			console.log(
				'Release Dashboard API service is listening on port',
				config.port
			);
		});
	})
	.catch(err => {
		console.log('err', err);
	});

function insertDefaultUser() {
	var User = model.user;
	var defaultUser = new User({
		email: 'admin@test.com',
		password: 'admin123',
		role: 'SuperAdmin'
	});

	User.findOne({
		email: defaultUser.email
	}).exec(function(err, user) {
		if (!user) defaultUser.save();
	});
}
