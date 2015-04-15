module.exports = function(app) {
	var booking = require('../controllers/booking.server.controller');

	app.get('/calendar/chargeTypes', booking.chargeTypes);

	app.post('/calendar/booking', booking.create);
	app.get('/calendar/booking', booking.list);
	app.route('/calendar/booking/:bookingId')
		.get(booking.read)
		.put(booking.update)
		.delete(booking.delete);

	app.param('bookingId', booking.bookingByID);

	app.route('/calendar/booking/byRoom/:bookingRoomId')
		.get(booking.listByRoom)

	app.param('bookingRoomId', booking.attachRoomID);
};
