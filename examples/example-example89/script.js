  angular.module('docsIsolationExample', [])
    .controller('Ctrl', function($scope) {
      $scope.naomi = { name: 'Naomi', address: '1600 Amphitheatre' };

      $scope.vojta = { name: 'Vojta', address: '3456 Somewhere Else' };
    })
    .directive('myCustomer', function() {
      return {
        restrict: 'E',
        scope: {
          customerInfo: '=info'
        },
        templateUrl: 'my-customer-plus-vojta.html'
      };
    });