var async = require('async');
var Booking = require('mongoose').model('Booking');
var Charge  = require('mongoose').model('Charge');

exports.list = function(req,res, next) {
	Booking.find({}).populate('_resources').populate('charges').exec(function(err, bookings) {
		if (err) {
			return next(err);
		}
		else {
			res.json(bookings);
		}
	});
};

exports.create = function(req, res, next) {
	console.log(req.body.charges);
	async.map(req.body.charges, createCharge, function(err, charges) {
		delete req.body.charges;
		var booking = new Booking(req.body);
		for (var i=0; i<charges.length; i++) {
			booking.charges.push(charges[i]);
		}
		booking.save(function(err) {
			if (err) {
				return next(err);
			} else {
				res.json(booking);
			}
		});
	});
}

function createCharge(body, fn) {
	var charge = new Charge(body);
	charge.save(function(err) {
		if (err)
			console.log(err);
		else
			fn(err, charge);
	});
}

function upsertCharge(body, fn) {
	id = body.id;
	delete body.id;
	Charge.findByIdAndUpdate(id, body, {upsert: true}, function(err) {
		if (err)
			console.log(err);
		else
			fn(err, charge);
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
			console.log("retrieved booking " + booking.id);
			req.booking = booking;
			next();
		}
	});
}


exports.update= function(req, res, next) {
	console.log("booking data->");
	console.log(req.body);
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
