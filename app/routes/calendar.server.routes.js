module.exports = function(app) {
	var booking = require('../controllers/booking.server.controller');
	var room = require('../controllers/room.server.controller');

	app.get('/calendar', room.render);
	app.post('/calendar/rooms', room.create);
	app.get('/calendar/rooms', room.list);

	app.route('/calendar/rooms/:roomId')
		.get(room.read)
		.put(room.update)
		.delete(room.delete);

	app.param('roomId', room.roomByID);


	app.post('/calendar/booking', booking.create);
	app.get('/calendar/booking', booking.list);
	app.route('/calendar/booking/:bookingId')
		.get(booking.read)
		.put(booking.update)
		.delete(booking.delete);

	app.param('bookingId', booking.bookingByID);
};
