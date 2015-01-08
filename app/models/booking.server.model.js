var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BookingSchema = new Schema({
	title: {type: String, required: true},
	start: {type: Date, required: true},
	end: {type: Date, required: true},
	allDay: {type: Boolean, required: true},
	client: {type: String, required: true},
	_resources: [{ 
		type: Schema.Types.ObjectId,
		ref: 'Room',
		required: true
	}]
});


BookingSchema.virtual('resources').get(function() {
	var resourceString = "";
	for (var i=0; i<this._resources.length; i++) {
		if (i>0) resourceString += " ";
		resourceString += this._resources[i]._id;
	}
	return resourceString;
});

BookingSchema.set('toJSON', { virtuals: true});
mongoose.model('Booking', BookingSchema);
