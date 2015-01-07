var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RoomSchema = new Schema({
    name: String
});

RoomSchema.set('toJSON', {getters: false, virtuals: true});
mongoose.model('Room', RoomSchema);

