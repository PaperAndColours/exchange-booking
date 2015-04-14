module.exports = function(app) {
	var index = require('../controllers/index.server.controller');
	app.get('/', function(req, res, next) {
		console.log("Executing the thingy");
		if (!req.user) {
			res.redirect('/signin');
		}
		else
			res.redirect('/calendar');
	});
	
	//app.get('/', index.render);
};
