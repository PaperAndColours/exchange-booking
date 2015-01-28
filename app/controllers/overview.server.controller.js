var Booking = require('mongoose').model('Booking');

exports.render = function(req,res, next) {
	Booking.find({}).populate('_resources').exec(function(err, bookings) {
		if (err) {
			return next(err);
		}
		else {
			res.render('overview', {
				bookings: bookings
			});
		}
	});
};
