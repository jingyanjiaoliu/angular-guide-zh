  angular.module('docsScopeProblemExample', [])
    .controller('NaomiCtrl', function($scope) {
      $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
      };
    })
    .controller('IgorCtrl', function($scope) {
      $scope.customer = {
        name: 'Igor',
        address: '123 Somewhere'
      };
    })
    .directive('myCustomer', function() {
      return {
        restrict: 'E',
        templateUrl: 'my-customer.html'
      };
    });