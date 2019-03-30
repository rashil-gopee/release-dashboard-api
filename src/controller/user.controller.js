var model = require('../model'),
    User = model.user,
    utils = require('../utils'),
    helper = utils.helper,
    setUserInfo = helper.setUserInfo;

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = function(req, res, next) {
    var userId = req.params.userId;

    if (req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
    User.findById(userId, (err, user) => {
        if (err) {
            res.status(400).json({ error: 'No user could be found for this ID.' });
            return next(err);
        }

        var userToReturn = setUserInfo(user);

        return res.status(200).json({ user: userToReturn });
    });
};