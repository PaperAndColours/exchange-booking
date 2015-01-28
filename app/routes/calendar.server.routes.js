module.exports = function(app) {
	var calendar = require('../controllers/calendar.server.controller');

	app.get('/calendar', calendar.render);
};
