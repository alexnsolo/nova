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

    $scope.$emit('JOIN_ROOM', {id: 'asdasd1d21dn29', name: roomName, users: [{name: userName}]});
    return;

    $meteor.call('CreateRoom', roomName, userName)
      .then(function(room) {
        $scope.$emit('JOIN_ROOM', room);
      })
      .catch(function(error) {
        window.alert(error);
        console.error(error);
      });
  };

  $scope.joinRoom = function() {
    var userName = window.prompt("Your name:");

    $scope.$emit('JOIN_ROOM', {id: $scope.roomId, users: [{name: userName}]});
    return;

    $meteor.call('JoinRoom', $scope.roomId, userName)
      .then(function(room) {
        $scope.$emit('JOIN_ROOM', room);
      })
      .catch(function(error) {
        window.alert(error);
        console.error(error);
      });
  };
}]);

angular.module('nova').controller('RoomController', ['$scope', function($scope) {
  $scope.leaveRoom = function() {
    $scope.$emit('LEAVE_ROOM');
  };
}]);
