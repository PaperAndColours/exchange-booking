module.exports = function(app) {
	var room = require('../controllers/room.server.controller');

	app.post('/calendar/rooms', room.create);
	app.get('/calendar/rooms', room.list);

	app.route('/calendar/rooms/:roomId')
		.get(room.read)
		.put(room.update)
		.delete(room.delete);

	app.param('roomId', room.roomByID);
};
