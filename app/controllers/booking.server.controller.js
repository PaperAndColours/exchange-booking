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

/*
exports.list = function(req, res) {
      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();
	res.send([
          {
            title: 'R1-R2: Lunch 12.15-14.45',
            start: new Date(y, m, d, 12, 15),
            end: new Date(y, m, d, 14, 45),
            allDay: false,
            resources: ['resource1', 'resource2']
          },
          {
            title: 'R1: All day',
            start: new Date(y, m, d, 10, 30),
            end: new Date(y, m, d, 11, 0),
            allDay: true,
            resources: 'resource1'
          },
          {
            title: 'R2: Meeting 11.00',
            start: new Date(y, m, d, 11, 0),
            allDay: true,
            resources: 'resource2'
          },
          {
            title: 'R1/R2: Lunch 12-14',
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false,
            resources: ['resource1', 'resource2']
          },
          {
            id: 777,
            title: 'R1: Lunch',
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false,
            resources: ['resource1']
          },
          {
            title: 'R3: Breakfast',
            start: new Date(y, m, d, 8, 0),
            end: new Date(y, m, d, 8, 30),
            allDay: false,
            resources: ['resource3']
          },
          {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d - 3, 16, 0),
          },
          {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d + 4, 16, 0),
            allDay: false,
            resources: 'resource2'
          }
	])
};
*/

