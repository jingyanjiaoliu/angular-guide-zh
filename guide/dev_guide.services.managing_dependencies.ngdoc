@ngdoc overview
@name 开发指南：Angular服务： 管理服务依赖
@description

angular允许服务根据自己构建实例的需要声明其他的实例作为自己的依赖.

要声明依赖，你首先要在factory函数签名中指定依赖，然后用依赖注入的注释来注释这个函数，它或者可以通过设置$inject属性为字符串标示符的数组(就是元素为字符串的数组)，或者可以通过数组标记.可选地，$inject属性声明可以被丢弃(查阅‘inferring $inject’章节，注意它当前只是个试验的特性).

使用数组标记:

<pre>
function myModuleCfgFn($provide) {
  $provide.factory('myService', ['dep1', 'dep2', function(dep1, dep2) {}]);
}
</pre>


使用$inject属性:

<pre>
function myModuleCfgFn($provide) {
  var myServiceFactory = function(dep1, dep2) {};
  myServiceFactory.$inject = ['dep1', 'dep2'];
  $provide.factory('myService', myServiceFactory);
}
</pre>


直接使用依赖注入(这种方法不支持代码压缩):

<pre>
function myModuleCfgFn($provide) {
  $provide.factory('myService', function(dep1, dep2) {});
}
</pre>


这里有两种服务例子，其中一个服务依赖另一个服务，这两个服务都依赖angular框架本身提供的服务:

<pre>
/**
 * batchLog service allows for messages to be queued in memory and flushed
 * to the console.log every 50 seconds.
 *
 * @param {*} message Message to be logged.
 */
  function batchLogModule($provide){
    $provide.factory('batchLog', ['$timeout', '$log', function($timeout, $log) {
      var messageQueue = [];

      function log() {
        if (messageQueue.length) {
          $log('batchLog messages: ', messageQueue);
          messageQueue = [];
        }
        $timeout(log, 50000);
      }

      // start periodic checking
      log();

      return function(message) {
        messageQueue.push(message);
      }
    }]);

    /**
     * routeTemplateMonitor monitors each $route change and logs the current
     * template via the batchLog service.
     */
    $provide.factory('routeTemplateMonitor',
                ['$route', 'batchLog', '$rootScope',
         function($route,   batchLog,   $rootScope) {
      $rootScope.$on('$routeChangeSuccess', function() {
        batchLog($route.current ? $route.current.template : null);
      });
    }]);
  }

  // get the main service to kick of the application
  angular.injector([batchLogModule]).get('routeTemplateMonitor');
</pre>

例子中需要引起注意的部分:

* batchLog服务依赖内建的{@link api/ng.$timeout $timeout}和{@link api/ng.$log $log}服务，作用是让调试信息批量的输出到控制台.
* routeTemplateMonitor服务依赖内建的 {@link api/ngRoute.$route
$route}服务和我们自定义的batchLog服务.
* 我们自定义的服务都使用factory函数签名和数组标示作为依赖注入的注释，来声明依赖的。其中很重要的是，数组中字符串元素的顺序和factory函数签名的参数顺序要保持一致，除非依赖是从函数签名推断出来的，否则带有依赖的数组和数组字符串元素的顺序决定了哪一个服务，以什么样的顺序进行诸如.


## 相关的主题

* {@link dev_guide.services.understanding_services 理解 Angular Services}
* {@link dev_guide.services.creating_services 创建 Angular Services}
* {@link dev_guide.services.injecting_controllers  将Angular Services注入到Controllers }
* {@link dev_guide.services.testing_services Angular Services测试}


## 相关的API

* {@link api/ng Angular Service API}
* {@link api/angular.injector Angular Injector API}

译者注：

  1. 理解angular注入方式: [再谈angularjs DI(Dependency Injection)](http://www.cnblogs.com/whitewolf/archive/2012/09/11/2680659.html)
  2. 理解angular注入机制: [Angularjs的IOC Inject分析](http://www.cnblogs.com/whitewolf/archive/2013/03/27/2983806.html)
  3. angular注入方式有三种，但是最简单的莫过于按名注入，但是这不利于生产环境的压缩混淆.推荐用数组内联注入方式.
  4. 如果对于已经有按名/推断注入的项目，可以采用ngmin插件修正项目.
