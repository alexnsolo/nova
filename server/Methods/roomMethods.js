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
        var roomToJoin = Rooms.findOne({_id:roomId});           // Query the data base for the give room id

        if (roomToJoin)
        {
            // Have to use #addToSet to update an array in the object
            Rooms.update({_id: roomToJoin._id}, {$addToSet:{users: user}});
            return Rooms.findOne({_id: roomToJoin._id});

        }
        else
        {
            throw new Meteor.Error("404", "Room does not exist");
        }


    },
    LeaveRoom: function()
    {
        //TODO: handle a users leaving the room
        //db.stores.update(
        //    { },
        //    { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } },
        //    { multi: true }
        //)
        console.log(this._id);
    }

});