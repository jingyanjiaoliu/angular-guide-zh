@ngdoc overview
@name Developer Guide: Angular Services: Creating Services
@description

翻译者:[@make dream](https://github.com/pengisgood)

# 创建服务

虽然Angular提供了一些有用的服务，但是对于一些重要的应用你会发现自定义一些服务也很有必要。要想自定义服务，首先，你要么通过 [Module#factory api](http://angular.duapp.com/api/angular.module)，要么直接通过module config函数内部的 [$provide api](http://angular.duapp.com/api/AUTO.$provide)，在module中注册一个服务工厂函数。

所有Angular的服务的 [dependency injection (DI)](http://angular.duapp.com/guide/di) 都是通过 Angular DI 系统（injector）按名注入的，并且需要给被注册的服务的工厂函数提供声明的服务的名称。在测试中，能够使用 mocks/stubs/dummies 使得服务具有很高的可测试性。

# 注册服务

要注册一个服务，首先，你要有一个包含该服务的 module。然后，你可以通过 [Module api](http://angular.duapp.com/api/angular.Module)，或者通过 module 中配置函数的 [$provide](http://angular.duapp.com/api/AUTO.$provide) 注册服务。下面的两段伪代码展示了这两种方法：

通过angular.Module api:
<pre>
var myModule = angular.module('myModule', []);
myModule.factory('serviceId', function() {
  var shinyNewServiceInstance;
  //工厂函数的函数体创建了shinyNewServiceInstance
  return shinyNewServiceInstance;
});
</pre>

通过$provide service:
<pre>
angular.module('myModule', [], function($provide) {
  $provide.factory('serviceId', function() {
    var shinyNewServiceInstance;
    //工厂函数的函数体创建了shinyNewServiceInstance
    return shinyNewServiceInstance;
  });
});
</pre>

注意：你不应该注册服务实例，而是注册一个在创建服务实例时被调用的工厂函数。

# 依赖

服务不仅可以被依赖，它们也可以有自己的依赖。依赖可以被当做工厂函数的参数，[参阅更多](http://angular.duapp.com/guide/di)关于 Angular 的依赖注入（DI）和使用数组表示法以及 `$inject` 属性使得依赖表示更加精简。

下面是一个简单服务的示例。该服务依赖于 `$window` 服务（`$window` 将作为参数传递到工厂函数中），它仅仅只是个函数而已。该服务只是简单的存储所有的通知，在存储完第三个后，它会通过 window alert 展现所有的通知。

<pre>
angular.module('myModule', [], function($provide) {
  $provide.factory('notify', ['$window', function(win) {
    var msgs = [];
    return function(msg) {
      msgs.push(msg);
      if (msgs.length == 3) {
        win.alert(msgs.join("\n"));
        msgs = [];
      }
    };
  }]);
});
</pre>

# 实例化Angular服务

所有的 Angular 服务都是延迟实例化的。这意味着，所有服务只有在需要实例化或者被其他的应用组件依赖时才会实例化。换句话说，Angular 不会实例化服务,除非它们被应用直接或间接用到。


# 作为单例的服务

最后，意识到 Angular 的所有服务都是单例是非常重要的，这意味着每个 injector 都只提供一个实例。因此，Angular 非常厌恶全局的状态。当然也可以创建多个 injector，每个 injector 都有自己服务的实例，但是这种情况极少，除了在测试中这种特性才特别重要。


## 相关话题

* [理解 Angular 服务](http://angular.duapp.com/guide/dev_guide.services.understanding_services)
* [管理服务依赖](http://angular.duapp.com/guide/dev_guide.services.managing_dependencies)
* [向控制器注入服务](http://angular.duapp.com/guide/dev_guide.services.injecting_controllers)
* [Angular 服务测试](http://angular.duapp.com/guide/dev_guide.services.testing_services)

## 相关API

* [Angular 服务 API](http://angular.duapp.com/api/ng)
