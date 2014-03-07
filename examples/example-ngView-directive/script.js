  angular.module('ngViewExample', ['ngRoute', 'ngAnimate'],
    function($routeProvider, $locationProvider) {
      $routeProvider.when('/Book/:bookId', {
        templateUrl: 'book.html',
        controller: BookCntl,
        controllerAs: 'book'
      });
      $routeProvider.when('/Book/:bookId/ch/:chapterId', {
        templateUrl: 'chapter.html',
        controller: ChapterCntl,
        controllerAs: 'chapter'
      });

      // configure html5 to get links working on jsfiddle
      $locationProvider.html5Mode(true);
  });

  function MainCntl($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
  }

  function BookCntl($routeParams) {
    this.name = "BookCntl";
    this.params = $routeParams;
  }

  function ChapterCntl($routeParams) {
    this.name = "ChapterCntl";
    this.params = $routeParams;
  }