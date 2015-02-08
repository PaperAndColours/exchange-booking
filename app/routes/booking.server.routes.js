module.exports = function(app) {
	var booking = require('../controllers/booking.server.controller');

	app.post('/calendar/booking', booking.create);
	app.get('/calendar/booking', booking.list);
	app.route('/calendar/booking/:bookingId')
		.get(booking.read)
		.put(booking.update)
		.delete(booking.delete);

	app.param('bookingId', booking.bookingByID);
};