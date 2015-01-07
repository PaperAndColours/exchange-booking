var Room = require('mongoose').model('Room');

exports.render = function(req,res, next) {
	Room.find({}, function(err, Rooms) {
		if (err) {
			return next(err);
		}
		else {
			res.render('resource-views', {
				title: "Hello world 2",
				resources: Rooms
			});
		}
	});
};

exports.list = function(req,res, next) {
	Room.find({}, function(err, Rooms) {
		if (err) {
			return next(err);
		}
		else {
			res.json(Rooms);
		}
	});
};


exports.create = function(req, res, next) {
	var room = new Room(req.body);
	room.save(function(err) {
		if (err) {
			return next(err);
		} else {
			res.json(Room);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.Room);
}

exports.RoomByID = function(req, res, next, id) {
	Room.findOne({
		_id: id
	}, function(err, Room) {
		if (err) {
			return next(err);
		} else {
			console.log("retrieved Room " + Room.id);
			req.Room = Room;
			next();
		}
	});
}


exports.update= function(req, res, next) {
	Room.findByIdAndUpdate(req.Room.id, req.body, function(err, Room) {
		if (err){
			return next(err);
		} else {
			res.json(Room);
		}
	});
}

exports.delete = function(req, res, next){
	req.Room.remove(function(err) {
		if (err){
			return next(err);
		} else {
			res.json(req.Room);	
		}
	});
};

/*exports.list = function(req, res) {
	res.send([
          {
            'id': 'resource1',
            'name': 'Green Room'
          },
          {
            'id': 'resource2',
            'name': 'Red Room'
          },
          {
            'id': 'resource3',
            'name': 'Magenta Room',
            'className': ['red']
          }
        ]);
}*/

