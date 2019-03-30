var moment = require('moment'),
    jwt = require('jwt-simple'),
    config = require('../config/app.config');

module.exports = function() {

    var generate = function(user) {

        var payload = {
            iss: user._id,
            expire: moment().add(config.duration, config.durationType),
            user: user
        };

        return jwt.encode(payload, config.secretKey, config.algorithm);

    };

    var isValid = function(payload) {

        var expiryDate = new Date(payload.expire);
        var currentDate = moment()._d;

        return (currentDate < expiryDate);
    };

    var decode = function(token) {
        return jwt.decode(token, config.secretKey);
    };

    return {
        generate: generate,
        isValid: isValid,
        decode: decode
    };

}();