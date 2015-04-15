var Room = require('mongoose').model('Room');
var Booking = require('mongoose').model('Booking');

exports.render = function(req,res, next) {
	Room.find({}, function(err, Rooms) {
		if (err) {
			return next(err);
		}
		else {
			res.render('preferences', {
				title: "Moseley Exchange Room Hire System",
				rooms: Rooms,
				userFullName: req.user ? req.user.fullName : ''
			});
		}
	});
};

exports.update = function(req, res, next) {
	data = req.body
	Room.find(function(err, serverRooms) {
		serverRoomIDs = [];
		if (typeof data.name === "string") {
			data.name = [data.name]
			data.className = [data.className]
			data.id = [data.id]
		}
		reqRoomIDs = data.id.slice();
		for (var i = 0; i < serverRooms.length; i++)
			serverRoomIDs.push(serverRooms[i].id);
		for (var i = 0; i < data.id.length; i++){
			reqRoom = {"name": data.name[i], "className": data.className[i], "id": data.id[i]};
			if (serverRoomIDs.indexOf(reqRoom.id)>=0){
				Room.findByIdAndUpdate(reqRoom.id, reqRoom, function(err, Room) {
					if (err){
						next(err);
					}
				});
				serverRoomIDs.splice(serverRoomIDs.indexOf(reqRoom.id), 1);
			}
			else {
				reqRoom.id = undefined
				Room.create(reqRoom, function(err, doc) {
					if (err){
						next(err);
					}
				});
			}
		}
		for (var i=0; i < serverRoomIDs.length; i++) {
			//console.log(serverRoomIDs[i])
			Room.findById(serverRoomIDs[i], function(err, room) {
					if (err){
						next(err);
					}
					else {
						Booking.find({"_resources": room}).remove().exec();
					}
			}).remove().exec();
		}
	})
	res.redirect("/calendar/preferences");
}

