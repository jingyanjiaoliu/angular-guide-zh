  angular.module('docsTransclusionDirective', [])
    .controller('Ctrl', function($scope) {
      $scope.name = 'Tobias';
    })
    .directive('myDialog', function() {
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'my-dialog.html'
      };
    });