module.exports = function(app) {
	var charge = require('../controllers/charge.server.controller');

	app.post('/calendar/charges', charge.create);
	app.get('/calendar/charges', charge.list);

	app.route('/calendar/charges/:chargeId')
		.get(charge.read)
		.put(charge.update)
		.delete(charge.delete);

	app.param('chargeId', charge.chargeByID);
};
