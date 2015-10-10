angular.module('nova', [
  'angular-meteor'
]);

angular.module('nova').run(function() {
  console.log('Nova initialized.');
});

angular.module('nova').controller('ViewController', ['$scope', function($scope) {
  $scope.viewState = 'lobby'; // 'room'
  $scope.currentRoom = null;

  $scope.$on('JOIN_ROOM', function(event, room) {
    $scope.viewState = 'room';
    $scope.currentRoom = room;
  });

  $scope.$on('LEAVE_ROOM', function(event) {
    $scope.viewState = 'lobby';
    $scope.currentRoom = null;
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
        $scope.$emit('JOIN_ROOM', room);
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
        $scope.$emit('JOIN_ROOM', room);
      })
      .catch(function(error) {
        window.alert("Error: " + error);
        console.error(error);
      });
  };
}]);

angular.module('nova').controller('RoomController', ['$scope', '$upload', function($scope, $upload) {
  $scope.isUploading = false;
  $scope.sprites = [];

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
        imageCode: data.public_id
      };

      $meteor.call('CreateSprite', sprite)
        .catch(function(error) {
          window.alert("Error: " + error);
          console.error(error);
        });
    });
  };
}]);
