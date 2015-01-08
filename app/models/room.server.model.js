var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RoomSchema = new Schema({
    name: {type: String, required: true},
});

RoomSchema.set('toJSON', {getters: false, virtuals: true});
mongoose.model('Room', RoomSchema);

