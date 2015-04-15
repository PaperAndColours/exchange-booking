var Room = require('mongoose').model('Room');
var Charge = require('mongoose').model('Charge');
var Booking = require('mongoose').model('Booking');

exports.chargeTypes = function(req, res, next) {
	var charge = new Charge();
	var chargeTypes = charge.schema.path('chargeType').enumValues;
	res.json(chargeTypes);
}

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

exports.listByRoom = function(req, res, next){
	Booking.find({"_resources": req.bookingRoom}, function(err, bookings) {
		if (err){
			return next(err);
		}
		else {
			res.json(bookings);
		}
	});
}

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

exports.attachRoomID = function(req, res, next, id) {
	Room.findById(id, function(err, room) {
		if (err){
			return next(err);
		}
		else{
			req.bookingRoom = room;
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
