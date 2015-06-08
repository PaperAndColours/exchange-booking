module.exports = function(app) {
	var overview = require('../controllers/overview.server.controller');
	app.get('/calendar/overview', overview.render);
	app.get('/calendar/overview/download', overview.csv);

	app.get('/calendar/overview/custom', overview.renderCustom);
	app.post('/calendar/overview/custom', overview.csv);
};
