$.cloudinary.config().cloud_name = Meteor.settings.public.cloudinary_cloud_name;
$.cloudinary.config().upload_preset = Meteor.settings.public.cloudinary_upload_preset;

angular.module('nova', [
  'angular-meteor',
  'cloudinary',
  'angularFileUpload',
  'ngDragDrop'
]);

angular.module('nova').run(function() {
  console.log('Nova initialized.');
});

angular.module('nova').controller('ViewController', ['$scope', function($scope) {
  $scope.viewState = 'lobby'; // 'room'
  $scope.currentRoom = null;
  $scope.currentUser = null;

  $scope.$on('JOIN_ROOM', function(event, room, user) {
    $scope.viewState = 'room';
    $scope.currentRoom = room;
    $scope.currentUser = user;
  });

  $scope.$on('LEAVE_ROOM', function(event) {
    $scope.viewState = 'lobby';
    $scope.currentRoom = null;
    $scope.currentUser = null;
  });
}]);

angular.module('nova').controller('LobbyController', ['$scope', '$meteor', function($scope, $meteor) {
  $scope.roomId = null;

  $scope.createRoom = function() {
    var roomName = window.prompt("Room name:");
    var userName = window.prompt("Your name:");
    var user = {name: userName};

    $meteor.call('CreateRoom', roomName, user)
      .then(function(room) {
        $scope.$emit('JOIN_ROOM', room, user);
      })
      .catch(function(error) {
        window.alert("Error: " + error);
        console.error(error);
      });
  };

  $scope.joinRoom = function() {
    var userName = window.prompt("Your name:");
    var user = {name: userName};

    $meteor.call('JoinRoom', $scope.roomId, user)
      .then(function(room) {
        $scope.$emit('JOIN_ROOM', room, user);
      })
      .catch(function(error) {
        window.alert("Error: " + error);
        console.error(error);
      });
  };
}]);

angular.module('nova').controller('RoomController', ['$scope', '$upload', '$meteor', function($scope, $upload, $meteor) {
  $scope.isUploading = false;
  $scope.$meteorSubscribe('SpriteInRoom', $scope.currentRoom._id)
  $scope.sprites = $scope.$meteorCollection(Sprites);

  $scope.leaveRoom = function() {
    $scope.$emit('LEAVE_ROOM');
  };

  $scope.uploadImage = function(files) {
    if (files.length == 0) {
      return;
    }

    $scope.isUploading = true;
    var upload = $upload.upload({
      url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
      file: files[0],
      fields: {
        upload_preset: $.cloudinary.config().upload_preset
      }
    });

    upload.success(function(data, status, headers, config) {
      $scope.isUploading = false;

      var sprite = {
        roomId: $scope.currentRoom._id,
        imageCode: data.public_id,
        xPos: 100,
        yPos: 100,
        state: {name: 'idle', user: null}
      };

      $meteor.call('CreateSprite', sprite)
        .then(function(sprite) {
        })
        .catch(function(error) {
          window.alert("Error: " + error);
          console.error(error);
        });
    });

    $scope.onSpriteStart = function(event, ui) {
      var spriteId = event.target.id;
      var state = {
        name: 'dragging',
        user: $scope.currentUser.name
      };

      $meteor.call('UpdateSpriteState', spriteId, state)
        .catch(function(error) {
          window.alert("Error: " + error);
          console.error(error);
        });
    };

    $scope.onSpriteStop = function(event, ui) {
      var spriteId = event.target.id;

      var state = {
        name: 'idle',
        user: null
      };

      $meteor.call('UpdateSpriteState', spriteId, state)
        .catch(function(error) {
          window.alert("Error: " + error);
          console.error(error);
        });
    };

    $scope.onSpriteDrag = function(event, ui) {
      var spriteId = event.target.id;
      var x = ui.position.left;
      var y = ui.position.top;

      $meteor.call('UpdateSpriteCords', spriteId, x, y)
        .catch(function(error) {
          window.alert("Error: " + error);
          console.error(error);
        });
    };

    $scope.canDragSprite = function(sprite) {
      if (!sprite) {
        return false;
      }
      if (!sprite.state) {
        return false;
      }

      if (sprite.state.name === 'dragging') {
        return sprite.state.user == $scope.currentUser.name;
      }

      return true;
    };

    $scope.getSpriteStateMessage = function(sprite) {
      if (!sprite) {
        return false;
      }
      if (!sprite.state) {
        return false;
      }

      if (sprite.state.name === 'dragging') {
        return "Dragging by '" + sprite.state.user + "'";
      }

      return '';
    }
  };
}]);
