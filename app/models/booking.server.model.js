var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
Currency = mongoose.Types.Currency;

var ChargeSchema = new Schema({
	rawAmount: {type: Currency,	min: 0},
    chargeType: {type: String, enum: ['booking', 'catering', 'other'], required: true},
    otherDesc: {type: String}
});

ChargeSchema.virtual('amount').get(function() {
	return (this.rawAmount/100).toFixed(2);
});

ChargeSchema.virtual('amount').set(function(value) {
	return this.rawAmount = value;
});

ChargeSchema.set('toObject', { virtuals: true, setters: true, getters: true });
ChargeSchema.set('toJSON', { virtuals: true, setters: true, getters: true });

mongoose.model('Charge', ChargeSchema);


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

BookingSchema.pre('validate', function(next) {
	if (this.start > this.end) {
		next(new Error("End Date must be greater than Start Date"));
	}
	else {
		next();
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

BookingSchema.set('toObject', { getters: true, virtuals: true});
BookingSchema.set('toJSON', { getters: true, virtuals: true});
mongoose.model('Booking', BookingSchema);
