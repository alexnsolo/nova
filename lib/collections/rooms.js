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

        room.id = Rooms.insert(room);
        return room;

    },
    JoinRoom: function()
    {

    }
});