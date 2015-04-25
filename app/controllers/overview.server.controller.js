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

generateCVSheaders = function() {
	headers = "Client\tInvoice Details\tStart Date\tStart Time\tEnd Date\tEnd Time\tRoom\tDescription\tProvisional\tCharges\t\n"
	console.log(headers);
	return headers
}
generateCVSbooking = function(booking, chargeSum) {
	row = "";
	row += booking.client + "\t";
	row += booking.invoiceDetails.replace("\n"," ") + "\t";
	row += booking.start.getDate() + "/" + booking.start.getMonth() + "/" + booking.start.getUTCFullYear() + "\t";
	startMins = booking.start.getMinutes() == 0 ? "00" : booking.start.getMinutes()
	row += booking.start.getHours() + ":" + startMins+ "\t";
	row += booking.end.getDate() + "/" + booking.end.getMonth() + "/" + booking.end.getUTCFullYear() + "\t";
	endMins = booking.end.getMinutes() == 0 ? "00" : booking.end.getMinutes()
	row += booking.end.getHours() + ":" + endMins+ "\t";

	row += booking._resources.name+ "\t";
	row += booking.description.replace("\n"," ") + "\t";
	row += booking.provisional+ "\t";
	row += "Total" + "\t";
	row += "£"+parseFloat(chargeSum).toFixed(2);
	row += "\t";
	return row;
}
generateCVScharge = function(charge) {
	row = "";
	row += charge.chargeType !=="other" ? charge.chargeType : charge.otherDesc;
	row += "\t";
	row += "£"+parseFloat(charge.amount).toFixed(2);
	row += "\t";
	return row;
}

exports.csv = function(req,res, next) {
	Booking.find({}).populate('_resources').exec(function(err, bookings) {
		if (err) {
			return next(err);
		}
		else {
			body = generateCVSheaders();
			for (var i=0; i<bookings.length; i++) {
				chargeList = []
				chargeSum = 0;
				for (var j=0; j<bookings[i].charges.length; j++) {
					chargeSum += parseFloat(bookings[i].charges[j].amount)
					chargeList.push(generateCVScharge(bookings[i].charges[j]));
				}
				body += generateCVSbooking(bookings[i], chargeSum)
				for (var j=0; j<chargeList.length; j++) {
					body += chargeList[j];
				}
				body += "\n";
			}
			res.attachment("report.csv")
			res.send(body);
		}
	});
};
