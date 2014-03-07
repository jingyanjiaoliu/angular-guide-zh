  angular.module('docsRestrictDirective', [])
    .controller('Ctrl', function($scope) {
      $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
      };
    })
    .directive('myCustomer', function() {
      return {
        restrict: 'E',
        templateUrl: 'my-customer.html'
      };
    });