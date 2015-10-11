Sprites = new Mongo.Collection("sprites");

Meteor.methods({
    CreateSprite: function(spriteObject)
    {
        // spriteObject is coming for the client, this set ups the schemea for the sprite record
        var sprite = spriteObject;
        sprite._id = Sprites.insert(sprite);
        return sprite;
    },
    UpdateSpriteCords: function(spriteId, xPos, yPos)
    {
        var sprite = Sprites.findOne({_id:spriteId});

        if (sprite)
        {
            Sprites.update({_id:spriteId}, {$set:{xPos:xPos, yPos: yPos}});
        }
        else
        {
            throw new Meteor.Error("404", "Sprite not found.");
        }
    },
    UpdateSpriteState: function(spriteId, stateObject)
    {
        // TODO: Handle 1+ people touching the sprite at the same time / access control
        var sprite = Sprites.findOne({_id:spriteId});

        if(sprite)
        {
            Sprites.update({_id:spriteId}, {$set:{state:stateObject}});
        }
        else
        {
            throw new Meteor.Error("404", "Sprite not found.");
        }


    }
});

