module.exports = function(app) {
	var calendar = require('../controllers/calendar.server.controller');

	if (process.env.NODE_ENV !== "development") {
		app.use('/calendar', function(req, res, next) {
			if (!req.user) {
				res.redirect('/');
			}
			else
				next();
		});
	}
	app.get('/calendar', calendar.render);
};
