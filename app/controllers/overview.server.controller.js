var Booking = require('mongoose').model('Booking');

exports.render = function(req,res, next) {
	Booking.find({}).populate('_resources').exec(function(err, bookings) {
		if (err) {
			return next(err);
		}
		else {
			res.render('overview', {
				bookings: bookings,
				userFullName: req.user ? req.user.fullName : ''
			});
		}
	});
};

exports.renderCustom = function(req,res, next) {
			res.render('CVSoptions', {
				title: "Moseley Exchange Room Hire System",
				userFullName: req.user ? req.user.fullName : ''
			});
};

getChargeTypes = function(bookings) {
	chargeTypes = []
	for (var i=0; i<bookings.length; i++) {
		for (var j=0; j<bookings[i].charges.length; j++) {
			var charge = bookings[i].charges[j];
			var chargeName = getChargeName(charge);
			if (chargeTypes.indexOf(chargeName) == -1)
				chargeTypes.push(chargeName);
		}
	}
	return chargeTypes;
}
generateCVSheaders = function(charges) {
	headers = ["Client", "Invoice Details", "Start Date", "Start Time", "End Date", "End Time", "Room", "Description", "Provisional", "Total"]
	headers = headers.concat(charges);
	headers = headers.join("\t");
	headers += "\n";
	return headers
}
generateCVSbooking = function(booking, charges) {
	row = "";
	row += booking.client + "\t";
	invoiceDetails = booking.invoiceDetails.replace(/\n|\r/g," ");
	invoiceDetails = (invoiceDetails.length > 0 ? invoiceDetails : " ") + "\t";
	row += invoiceDetails;
	row += booking.start.getDate() + "/" + (booking.start.getMonth()+1) + "/" + booking.start.getUTCFullYear() + "\t";
	startMins = booking.start.getMinutes() == 0 ? "00" : booking.start.getMinutes()
	row += booking.start.getUTCHours() + ":" + startMins+ "\t";
	row += booking.end.getDate() + "/" + (booking.end.getMonth()+1) + "/" + booking.end.getUTCFullYear() + "\t";
	endMins = booking.end.getMinutes() == 0 ? "00" : booking.end.getMinutes()
	row += booking.end.getUTCHours() + ":" + endMins+ "\t";

	row += booking._resources.name+ "\t";
	description = booking.description.replace(/\n|\r/g," ");
	description = (description.length > 0 ? description : " ") + "\t";
	row += description;
	row += booking.provisional+ "\t";
	row += charges;
	return row;
}

getChargeName = function(charge) {
		var chargeRealName = charge.chargeType !=="other" ? charge.chargeType : charge.otherDesc;
		return chargeRealName;
}

generateCVScharges = function(charges, chargeTypes) {
	if (charges === undefined) return "";
	var chargeList = []
	var total = 0;
	for (var i=0; i<charges.length; i++) {
		var charge = charges[i];
		var chargeName = getChargeName(charge);
		var idx = chargeTypes.indexOf(chargeName);
		if (chargeList[idx] !== undefined){
			console.log(chargeList[idx]);
			chargeList[idx] = parseFloat(charge.amount) + parseFloat(chargeList[idx]);
			console.log(chargeList[idx]);
			console.log("----");
			}
		else
			chargeList[idx] = charge.amount;
		total += parseFloat(charge.amount);
	}

	chargeList = [total].concat(chargeList);
	chargeList = chargeList.map(function(a) {
		if (a === undefined) 
			return "";
		else 
			return parseFloat(a).toFixed(2);
	});
	row = chargeList.join("\t");
	return row;
}
exports.csv = function(req,res, next) {
	if (req.body !== undefined) 
		console.log("Form submission")

	Booking.find({}).sort([['start', 'ascending']]).populate('_resources').exec(function(err, bookings) {
		if (err) {
			return next(err);
		}
		else {
			chargeTypes = getChargeTypes(bookings);
			body = generateCVSheaders(chargeTypes);
			for (var i=0; i<bookings.length; i++) {
				charges = generateCVScharges(bookings[i].charges, chargeTypes);
				body += generateCVSbooking(bookings[i], charges)
				body += "\n";
			}
			res.attachment("report.csv");
			res.send(body);
		}
	});
};
