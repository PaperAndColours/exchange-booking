var Booking = require('mongoose').model('Booking');

exports.list = function(req,res, next) {
	Booking.find({}).populate('_resources').exec(function(err, bookings) {
		if (err) {
			return next(err);
		}
		else {
			res.json(bookings);
		}
	});
};

exports.create = function(req, res, next) {
	var booking = new Booking(req.body);
	booking.save(function(err) {
		if (err) {
			return next(err);
		} else {
			res.json(booking);
		}
	});
}


exports.read = function(req, res) {
	res.json(req.booking);
}

exports.bookingByID = function(req, res, next, id) {
	Booking.findOne({
		_id: id
	}, function(err, booking) {
		if (err) {
			return next(err);
		} else {
			req.booking = booking;
			next();
		}
	});
}


exports.update= function(req, res, next) {
	Booking.findByIdAndUpdate(req.booking.id, req.body, function(err, booking) {
		if (err){
			return next(err);
		} else {
			res.json(booking);
		}
	});
}

exports.delete = function(req, res, next){
	req.booking.remove(function(err) {
		if (err){
			return next(err);
		} else {
			res.json(req.booking);	
		}
	});
};
