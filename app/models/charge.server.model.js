var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChargeSchema = new Schema({
	amount: {type: Number},
    chargeType: {type: String, enum: ['booking', 'catering', 'other'], required: true},
    otherDesc: {type: String}
});

ChargeSchema.set('toJSON', {getters: false, virtuals: true});
mongoose.model('Charge', ChargeSchema);

