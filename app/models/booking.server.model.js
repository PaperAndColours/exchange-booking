var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChargeSchema = new Schema({
	amount: {type: Number},
    chargeType: {type: String, enum: ['booking', 'catering', 'other'], required: true},
    otherDesc: {type: String}
});

var BookingSchema = new Schema({
	client: {type: String, required: true},
	start: {type: Date, required: true},
	end: {type: Date, required: true},
	provisional: {type: Boolean, required: true},
	description: {type: String, required: false },
	_resources: { 
		type: Schema.Types.ObjectId,
		ref: 'Room',
		required: true
	},
	charges: [ChargeSchema]
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
