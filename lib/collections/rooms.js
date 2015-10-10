Rooms = new Mongo.Collection("rooms");


Meteor.methods({
    // Creates a room for each game
    CreateRoom: function(name, user)
    {
        var room = {
            name: name,
            users: [user],
            createdAt: Date.now()

        };

        room._id = Rooms.insert(room);
        return room;

    },
    JoinRoom: function(roomId, user)
    {
        roomToJoin = Rooms.findOne({_id:roomId});

        console.log(roomId);
        if (roomToJoin)
        {
            Rooms.update({_id: roomToJoin._id}, {$addToSet:{users: user}});
            return roomToJoin;

        }
        else
        {
            throw new Meteor.Error("404", "Room does not exist");
        }
    }
});
