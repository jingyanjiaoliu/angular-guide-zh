  var myApp = angular.module('spicyApp2', []);

  myApp.controller('SpicyCtrl', ['$scope', function($scope){
      $scope.customSpice = "wasabi";
      $scope.spice = 'very';
      
      $scope.spicy = function(spice){
          $scope.spice = spice;
      };
  }]);