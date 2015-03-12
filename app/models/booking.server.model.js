var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BookingSchema = new Schema({
	client: {type: String, required: true},
	start: {type: Date, required: true},
	end: {type: Date, required: true},
	allDay: {type: Boolean, required: true},
	description: {type: String, required: false },
	_resources: { 
		type: Schema.Types.ObjectId,
		ref: 'Room',
		required: true
	}
});


BookingSchema.virtual('title').get(function() {
	return this.client;
});

BookingSchema.virtual('resources').get(function() {
	return this._resources._id;
});

BookingSchema.virtual('color').get(function() {
	return this._resources.className;
})
BookingSchema.virtual('backgroundColor').get(function() {
	return this._resources.className;
});

BookingSchema.set('toJSON', { virtuals: true});
mongoose.model('Booking', BookingSchema);
