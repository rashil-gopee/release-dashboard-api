var fs = require('fs'),
	mongoose = require('mongoose'),
	multiparty = require('multiparty'),
	Grid = require('gridfs-stream'),
	config = require('../config/app.config');

eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);


mongoose.Promise = global.Promise;

var connection = mongoose.createConnection(config.mongodb);

var postFile = function (req, res) {
	var gfs = Grid(connection.db, mongoose.mongo);

	var form = new multiparty.Form();

	form.parse(req, function (err, fields, files) {
		if (files && files.file) {
			var file = files.file[0];

			var fileId = mongoose.Types.ObjectId();

			var writestream = gfs.createWriteStream({
				_id: fileId,
				filename: file.originalFilename,
				content_type: file.headers['content-type']
			});

			fs.createReadStream(file.path).pipe(writestream);

			writestream.on('close', function (file) {
				res.send(file);
			});
		} else if (files && files.file0) {
			var file = files.file0[0];

			var fileId = mongoose.Types.ObjectId();

			var writestream = gfs.createWriteStream({
				_id: fileId,
				filename: file.originalFilename,
				content_type: file.headers['content-type']
			});

			fs.createReadStream(file.path).pipe(writestream);

			writestream.on('close', function (file) {
				res.send(file);
			});
		} else {
			res.send(400);
		}

	});
};

var getFile = function (req, res) {
	var gfs = Grid(connection.db, mongoose.mongo);
	gfs.findOne({
		_id: req.params.id
	}, function (err, file) {
		if (err)
			res.status(500).send(err);
		else {
			var readStream = gfs.createReadStream({
				_id: file._id
			});
			res.set('Content-Type', file.contentType);
			readStream.pipe(res);
		}
	});
};

exports.postFile = postFile;
exports.getFile = getFile;