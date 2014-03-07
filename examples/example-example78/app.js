    var myApp = angular.module('scopeInheritance', []);
    myApp.controller('MainCtrl', ['$scope', function($scope){
      $scope.timeOfDay = 'morning';
      $scope.name = 'Nikki';
    }]);
    myApp.controller('ChildCtrl', ['$scope', function($scope){
      $scope.name = 'Mattie';
    }]);
    myApp.controller('GrandChildCtrl', ['$scope', function($scope){
      $scope.timeOfDay = 'evening';
      $scope.name = 'Gingerbreak Baby';
    }]);