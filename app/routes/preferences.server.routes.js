module.exports = function(app) {
	var preferences = require('../controllers/preferences.server.controller');
	var room = require('../controllers/room.server.controller');

	app.get('/calendar/preferences', preferences.render);
	app.post('/calendar/preferences', preferences.update);
};
