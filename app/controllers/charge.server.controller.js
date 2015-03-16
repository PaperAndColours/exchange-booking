var Charge = require('mongoose').model('Charge');

exports.list = function(req,res, next) {
	Charge.find({}, function(err, Charges) {
		if (err) {
			return next(err);
		}
		else {
			res.json(Charges);
		}
	});
};


exports.create = function(req, res, next) {
	var charge = new Charge(req.body);
	charge.save(function(err) {
		if (err) {
			return next(err);
		} else {
			res.json(Charge);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.Charge);
}

exports.chargeByID = function(req, res, next, id) {
	Charge.findOne({
		_id: id
	}, function(err, Charge) {
		if (err) {
			return next(err);
		} else {
			console.log("retrieved Charge " + Charge.id);
			req.Charge = Charge;
			next();
		}
	});
}


exports.update= function(req, res, next) {
	Charge.findByIdAndUpdate(req.Charge.id, req.body, function(err, Charge) {
		if (err){
			return next(err);
		} else {
			res.json(Charge);
		}
	});
}

exports.delete = function(req, res, next){
	req.Charge.remove(function(err) {
		if (err){
			return next(err);
		} else {
			res.json(req.Charge);	
		}
	});
};

