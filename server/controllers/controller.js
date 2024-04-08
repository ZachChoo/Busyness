const Building = require('../models/model');
const PastBusyness = require('../models/pastBusyness')
const jwt = require("jsonwebtoken")

protect = (req, res, next) => {

    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'Missing bearer token' });
    };

    let token = authHeader.split(' '); // split with Bearer
    if (token.length < 2) return res.status(401).json({ message: 'Authorization token not in right form.' });
    token = token[1]; // get just token
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (err) {
        return res.status(401).json({ message: err.message || 'Could not decode the token'})
    };
    if (decodedToken.user != "admin") return res.status(401).json({message: "not admin"});
    console.log(decodedToken);

    return next();
}

get_token = (req, res) => {
    if(req.body.password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(
            { user: "admin" },
            process.env.TOKEN_KEY,
            {
            expiresIn: "2h",
            }
        );

        return res.status(200).json({success: true, token})
    }
    return res.status(401).json({success: false, message: "Incorrect password. Please try again."});

}

is_authenticated = (req, res) => {

    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(200).json({ authenticated: false });
    };

    let token = authHeader.split(' '); // split with Bearer
    if (token.length < 2) return res.status(200).json({ authenticated: false });
    token = token[1]; // get just token
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (err) {
        return res.status(200).json({ authenticated: false })
    };
    if (decodedToken.user != "admin") return res.status(200).json({ authenticated: false });
    
    return res.status(200).json({ authenticated: true });
}


//Building operations

createBuilding = (req, res) => {
    Building.create({
        name: req.query.name || req.body.name,
        image: req.query.image || req.body.image        
    }).then((data) => {
        return res.status(200).json({ success: true, data: data });
    }).catch((err) => {
        return res.status(500).json({ success: false, err: err });
    })
}

updateBuilding = (req, res) => {
    Building.findOne({ _id: (req.query.id || req.body.id)?.trim() }).then(building => {
        if (req.query.name || req.body.name) {
            building.name = (req.query.name || req.body.name)?.trim();
        }

        if (req.query.image || req.body.image) {
            building.image = (req.query.image || req.body.image)?.trim();
        }

        building.save();
        return res.status(200).json({ success: true, data: building });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    })
} 

deleteBuilding = (req, res) => {
    var req_id = (req.query.id || req.body.id)?.trim()
    Building.findOne({ _id: req_id }).then(building => {
        if(!building || !building.rooms) return;
        for (var i = 0; i < building.rooms.length; i++) {
            PastBusyness.deleteMany({roomId: building.rooms[i]._id});
        }
    }).then(() => {
        Building.findOneAndDelete({ _id: req_id}, (err, data) => {
            return handler(res, err, data);
        })
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    })    
}

getBuildingById = (req, res) => {
    Building.findOne({ _id: (req.query.id || req.body.id)?.trim() }, (err, data) => {
        return handler(res, err, data);
    })
}

getBuildings = (req, res) => {
    Building.find({}, (err, data) => {
        return handler(res, err, data);
    })
}

getAllRoomsInAllBuildings = (req, res) => {
    Building.find({}, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, error: err });
        }
    
        if (!data) {
            return res.status(404).json({ success: false, error: 'building(s) not found' });
        }

        var allRooms = []
        for (var i = 0; i < data.length; i++) {
            allRooms = allRooms.concat(data[i].rooms);
        }
        return res.status(200).json({ success: true, data: allRooms });
    })
}

function handler(res, err, data) {
    if (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    }

    if (!data) {
        return res.status(404).json({ success: false, error: 'building(s) not found' });
    }
    
    return res.status(200).json({ success: true, data: data });
}

//Room operations

createRoom = (req, res) => {
    var req_id = (req.query.id || req.body.id)?.trim();
    var req_deviceCount = (req.query.deviceCount || req.body.deviceCount);
    var req_maxCapacity = (req.query.maxCapacity || req.body.maxCapacity);
    var req_roomName = (req.query.roomName || req.body.roomName)?.trim();
    var req_closingTime = (req.query.closingTime || req.body.closingTime)?.trim();
    var req_date = (req.query.date || req.body.date);

    var req_busyness = Math.round(Math.min(100, req_deviceCount / req_maxCapacity * 100));
    
    Building.findOne({ _id: req_id }).then(building => {
        if (!req_roomName || !req_closingTime || !req_deviceCount || !req_maxCapacity) {
            throw 'missing info'
        }

        var newRoom = {
            roomName: req_roomName,
            closingTime: req_closingTime,
            maxCapacity: req_maxCapacity,
            deviceCount: req_deviceCount,
            busyness: req_busyness,
            building: req_id
        }

        building.rooms.push(newRoom);
        building.save()
        return building.rooms.find(element => element.roomName == req_roomName);
    }).then((room) => {
        PastBusyness.create({
            createdAt: Date.now(),
            roomId: room._id,
            date: req_date ? req_date : Date.now(),
            currBusyness: req_busyness   
        })
        return room;
    }).then(data => {
        return res.status(200).json({ success: true, data: data });
    }).catch(err => { 
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    })
}

updateRoom = (req, res) => {
    var req_id = (req.query.id || req.body.id)?.trim();
    var req_roomid = (req.query.roomid || req.body.roomid)?.trim();
    var req_deviceCount = (req.query.deviceCount || req.body.deviceCount);
    var req_maxCapacity = (req.query.maxCapacity || req.body.maxCapacity);
    var req_roomName = (req.query.roomName || req.body.roomName)?.trim();
    var req_closingTime = (req.query.closingTime || req.body.closingTime)?.trim();
    var req_date = (req.query.date || req.body.date);

    if (!req_id || !req_roomid) {
        return res.status(500).json({ success: false, error: "missing id" });
    }

    Building.findOne({ _id: req_id}).then(building => {
        var room = building.rooms.find(element => element._id == req_roomid);
        room.deviceCount = req_deviceCount ? req_deviceCount : room.deviceCount;
        room.maxCapacity = req_maxCapacity ? req_maxCapacity : room.maxCapacity;
        room.roomName = req_roomName ? req_roomName : room.roomName;
        room.closingTime = req_closingTime ? req_closingTime : room.closingTime;
        var req_busyness = Math.round(Math.min(100, room.deviceCount / room.maxCapacity * 100));
        room.busyness = req_busyness;
        building.save();
        return({
            busyness: req_busyness,
            room: room
        })
    }).then((data) => {
        if (req_deviceCount || req_maxCapacity) {
            PastBusyness.create({
                createdAt: Date.now(),
                roomId: req_roomid,
                date: req_date ? req_date : Date.now(),
                currBusyness: data.busyness
            })
        }
        return res.status(200).json({ success: true, data: data.room});
    }).catch(err => { 
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    })
}

deleteRoom = (req, res) => {
    let found = false
    var req_id = (req.query.id || req.body.id)?.trim();
    var req_roomid = (req.query.roomid || req.body.roomid)?.trim();
    PastBusyness.deleteMany({roomId: req_roomid}).catch(err => {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    })
    Building.findOne({ _id: req_id }).then(building => {
        for (var i = 0; i < building.rooms.length; i++) {
            if (building.rooms[i]._id == req_roomid) {
                building.rooms.splice(i, 1);
                found = true
                break;
            }
        }

        if (!found) {
            return res.status(500).json({ success: false, error: "no room found" });
        }

        building.save();
        return res.status(200).json({ success: true, data: building });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    })
}

getRooms = (req, res) => {
    Building.findOne({ _id: (req.query.id)?.trim() }).then(building => {
        return res.status(200).json({ success: true, data: building.rooms });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    })
}

getRoomById = (req, res) => {
    Building.findOne({ _id: (req.query.id)?.trim() }).then(building => {
        let room = building.rooms.find(element => element._id == req.query.roomid?.trim());
        if (!room) {
            return res.status(500).json({ success: false, error: "room not found" });
        }
        return res.status(200).json({ success: true, data: room });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    })
}

getPastBusyness = (req, res) => {
    PastBusyness.find({}, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, error: err });
        }

        return res.status(200).json({ success: true, data: data });
    })
}

getPastBusynessOfRoom = (req, res) => {
    PastBusyness.find({ roomId: (req.query.roomid)?.trim() }, (err, data) => {
        handler(res, err, data)
    })
}

module.exports = {
    protect,
    get_token,
    is_authenticated,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    getBuildings,
    getBuildingById,
    getAllRoomsInAllBuildings,
    createRoom,
    updateRoom,
    deleteRoom,
    getRooms,
    getRoomById,
    getPastBusyness,
    getPastBusynessOfRoom
}
