var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BookingSchema = new Schema({
	title: String,
	start: Date,
	end: Date,
	allDay: Boolean,
	client: String,
	_resources: [{ 
		type: Schema.Types.ObjectId,
		ref: 'Room'
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
