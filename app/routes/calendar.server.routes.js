module.exports = function(app) {
	var booking = require('../controllers/booking.server.controller');
	var room = require('../controllers/room.server.controller');


	app.post('/calendar', booking.create);
	app.get('/calendar/getEvents', booking.list);

	app.get('/calendar', room.render);
	app.get('/calendar/rooms', room.list);
	app.post('/calendar/rooms', room.create);
};
