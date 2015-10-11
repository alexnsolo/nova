Meteor.publish('SpriteInRoom', function (roomId) {
    return Sprites.find({roomId: roomId});
});