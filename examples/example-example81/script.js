  angular.
   module('MyServiceModule', []).
   factory('notify', ['$window', function(win) {
      var msgs = [];
      return function(msg) {
        msgs.push(msg);
        if (msgs.length == 3) {
          win.alert(msgs.join("\n"));
          msgs = [];
        }
      };
    }]);

  function myController(scope, notifyService) {
    scope.callNotify = function(msg) {
      notifyService(msg);
    };
  }

  myController.$inject = ['$scope','notify'];