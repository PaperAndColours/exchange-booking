var Room = require('mongoose').model('Room');

exports.render = function(req,res, next) {
	Room.find({}, function(err, Rooms) {
		if (err) {
			return next(err);
		}
		else {
			res.render('calendar', {
				resources: Rooms,
				userFullName: req.user ? req.user.fullName : ''
			});
		}
	});
};

