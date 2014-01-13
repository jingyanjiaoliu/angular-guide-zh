@ngdoc overview
@name Developer Guide: Providers
@description
翻译者:[@lightma](https://github.com/lightma)

# Providers
你所构建的每个web应用都是由互相协作以达成特定目标的对象构成。为了让应用得以运行，这些对象还需要被实例化并绑定在一起。在基于Angular框架的应用里，这些对象大都是通过{@link api/AUTO.$injector 注入服务}自动地实例化并绑定在一起。

注入器创建两类对象，**服务**和**专用对象**。

**服务**是对象，而这些对象的API是由编写服务的开发人员所决定的。

**专用对象**遵循Angular框架特定的API。这些对象包括**控制器**，**指令**，**过滤器**或**动画**。

注入器需要知道如何去创建这些对象。你应该通过注册一种“图纸”来告诉Angular如何创建你的对象。这里共有5种图纸。

最冗长同时又最复杂的图纸是Provider图纸，其余4种分别是 —— Value，Factory，Service和Constant，这4种都只是基于Provider之上的语法糖。

现在让我们看看通过不同图纸来创建和使用服务的场景。首先我们从最简单的例子开始 —— 你代码在很多地方都要使用同一个字符串，这个场景下，我们通过Value图纸来完成服务的创建。

## 注意：关于模块。

为了使注入器知道如何创建这些对象，并让它们能绑定在一起协同工作，我们需要一张关于“图纸”的注册表。每个图纸都有对象的识别码以及如何创建该对象的说明。

每个图纸都属于一个{@link api/angular.Module Angular模块}。一个Angular模块就像是装着一张或多张图纸的袋子。通过手工记录模块依赖关系是很无趣的工作，所以一个模块里也应该包含该模块依赖于哪些其他模块的信息。

当基于Angular的应用从一个指定的应用模块启动时，Angular会创建一个注入器的实例，紧接着该注入器实例就会创建一张包含“图纸”的注册表，这张注册表就是由Angular核心模块、应用模块以及应用模块的依赖里面定义的所有图纸的集合。当注入器需要为你的应用创建一个对象时，注入器就会查询这张注册表。

## Value 图纸

假设我们要实现一个非常简单的服务叫做"clientId"，该服务提供一个表示调用某些远程API时会用到的鉴权id的字符串。

```javascript
var myApp = angular.module('myApp', []);
myApp.value('clientId', 'a12345654321x');
```
请注意我们如何创建一个叫做"myApp"的Angular模块，以及如何指出该模块中包含构建用于`clientId`服务的图纸。在这个例子中`clientId`服务只是一个简单的字符串。

下面我们通过Angular的数据绑定来显示clientId：

```javascript
myApp.controller('DemoController', ['clientId', function DemoController(clientId) {
  this.clientId = clientId;
}]);
```

```html
<html ng-app="myApp">
  <body ng-controller="DemoController as demo">
    Client ID: {{demo.clientId}}
  </body>
</html>
```
在上面的例子中，当`DemoController`需要id为"clientId"的服务时，我们通过Value图纸定义了需要注入过去的值。

好了，接下来，我们来学习更复杂的例子！

## Factory 图纸

虽然Value图纸很容易编码，但缺少很多我们在创建服务时需要的重要特性。让我们看看比Value图纸更强大的兄弟 —— Factory图纸。

Factory图纸增加了以下能力：

* 使用其他服务的能力(即可以有依赖)
* 服务初始化
* 延迟/惰性初始化

Factory图纸通过一个拥有0～n个参数(参数表示该服务对其他服务的依赖)的函数来创建服务，而函数返回值就是Factory图纸创建的服务实例。

注意：Angular框架里所有的服务都是单例对象。这意味着注入器只会使用一次图纸来创建服务实例，然后注入器就会缓存这些服务实例的引用，以备将来使用。

既然我们说Factory是功能相比Value图纸更强大图纸类型，那么你当然可以通过Factory图纸来创建相同的服务。
针对我们前面举的`clientId`的Value图纸例子，我们可以用Factory图纸做如下重新实现：


```javascript
myApp.factory('clientId', function clientIdFactory() {
  return 'a12345654321x';
});
```

但是既然token只是一个字符串常量，我们还是坚持使用Value图纸吧，这样使得代码更简洁明了。

但是，假如我们想创建另一个服务，在调用远程API时，该服务可以用来计算鉴权token。这个token叫做'apiToken'，并且是基于`clientId`的值和一个存储在浏览器本地存储的密码计算出来的：


```javascript
myApp.factory('apiToken', ['clientId', function apiTokenFactory(clientId) {
  var encrypt = function(data1, data2) {
    // NSA-proof加密算法：
    return (data1 + ':' + data2).toUpperCase();
  };

  var secret = window.localStorage.getItem('myApp.secret');
  var apiToken = encrypt(clientId, secret);

  return apiToken;
}]);
```

在上面的代码里，我们能看到依赖于`clientId`服务的`apiToken`服务是如何通过Factory图纸定义的。这个工厂服务使用NSA-proof加密来生成鉴权token。

注意：将工厂方法命名为"Factory"是最佳实践（比如，apiTokenFactory）。虽然这种命名方式不是强制性的，但是它有助于浏览代码仓库或者在调试器里跟踪调用堆栈。

就像Value图纸一样，Factory图纸能创建任何类型的服务，不管是原生类型，对象常量，函数，甚至自定义类型的实例。

## Service 图纸

Javascript开发人员经常使用自定义类型来编写面向对象的代码。现在，让我们一起探讨如何通过自定义类型实例——`unicornLauncher`服务，将一头独角兽发射到太空中去：

```javascript
function UnicornLauncher(apiToken) {

  this.launchedCount = 0;
  this.launch() {
    // 带上apiToken来发起远程调用
    ...
    this.launchedCount++;
  }
}
```

现在我们准备发射独角兽，但我们注意到`UnicornLauncher`依赖于我们的`apiToken`.我们可以通过使用Factory图纸来满足对`apiToken`的依赖：

```javascript
myApp.factory('unicornLauncher', ["apiToken", function(apiToken) {
  return new UnicornLauncher(apiToken);
}]);
```

然而，这个用例使用Service图纸最合适。

Service图纸实例化服务时，和Value和Factory图纸类似，只是它通过*使用 `new` 操作符调用构造函数*来实现。构造函数可以接受0～n个参数，这些参数代表着该服务实例的依赖。

注意：Service图纸遵循 {@link http://www.martinfowler.com/articles/injection.html#ConstructorInjectionWithPicocontainer "构造函数注入"} 的设计模式。

既然我们已经拥有了`UnicornLauncher`类型的构造函数，我们可以像下面代码那样使用Service图纸来替代以上的Factory图纸：

```javascript
myApp.service('unicornLauncher', ["apiToken", UnicornLauncher]);
```

是不是更简单了！

注意：是的，我们将一种Service图纸命名为'Service'型，我们对此感到后悔，并且知道我们将来会以某种形式受到惩罚。就像为我们的儿女之一取名叫“孩子”一样，“孩子”，这会惹恼老师的。（译者代言：愿语文老师宽恕我）。

## Provider 图纸

只剩下两种图纸没介绍。他们都太过专业并且也很少被用到。就像我们在开头介绍的那样，Provider图纸是核心的图纸类型，而其他的图纸类型只是基于它的语法糖。Provider图纸拥有最大的能力但又最晦涩难懂，通常对于大部分的服务来说，如果用Provider图纸来实现就好比杀鸡用牛刀。


Provider图纸从语法上来说，只是一个实现了`$get`方法的自定义类型。`$get`方法是一个工厂方法，就像我们在Factory图纸里用到的工厂方法一样。实际上，在你定义Factory图纸时，一个空的Provider类型会被隐式的创建，并且`$get`方法就被设置为Factory图纸的工厂方法。

<div class="alert alert-info">
可以看看Angular对于Factory和Provider的源代码实现
```javascript
function factory(name, factoryFn) { return provider(name, { $get: factoryFn }); }
```
</div>

当你需要为在应用运行前就必须设置好的全局配置项提供API时，你才需要用到Provider图纸。

假设我们的`unicornLauncher`服务是如此棒，以至于有好多应用都用到它。默认情况下，发射器将独角兽发射到太空中不需要任何保护屏障。但是在某些星球上，由于大气层非常厚，我们在将独角兽送去做星际旅行前必须将它们包裹在铝箔里，不然它们在穿越大气层时就被烧毁了。在一些应用里，需要设置发射器在每次发射时都使用铝箔屏蔽，如果我们能按需配置这一点那就太棒了。我们可以像下面这样让它变得可配置：

```javascript
myApp.provider('unicornLauncher', function UnicornLauncherProvider() {
  var useTinfoilShielding = false;

  this.useTinfoilShielding = function(value) {
    useTinfoilShielding = !!value;
  };

  this.$get = ["apiToken", function unicornLauncherFactory(apiToken) {

    // 这里我们假设UnicornLauncher的构造函数也被改造得支持useTinfoilShielding参数了
    return new UnicornLauncher(apiToken, useTinfoilShielding);
  }];
});
```

为了在应用里开启铝箔屏蔽层，我们需要通过模块API来创建一个配置函数，并将UnicornLauncherProvider注入：

```javascript
myApp.config(["unicornLauncherProvider", function(unicornLauncherProvider) {
  unicornLauncherProvider.useTinfoilShielding(true);
}]);
```

请注意，unicornLauncherProvider被注入到配置函数，这种注入通过provider注入器实现，这种注入器有别于常规的实例注入器，在provider注入器里，它只实例化并注入所有的provider实例。

在应用引导阶段，也就是在Angular开始创建服务之前，Angular配置和实例化所有provider。我们把这个过程称为应用生命周期的配置阶段。在这个阶段中，服务不能被访问，因为它们根本都还没有被创建（只是provider被实例化了，由provider创建并返回的服务是还没有被创建的）。（译注：比如$httpProvider服务被创建并实例化了，但是作为$httpProvider所返回的服务$http还无法创建。）

一旦**配置阶段**结束，与provider的交互就被禁止了，而创建服务的过程开始。我们把应用生命周期的这个阶段叫做**运行阶段**。


## Constant 图纸


我们刚刚学习了Angular是如何将生命周期划分为**配置阶段**和**运行阶段**，以及怎样通过配置函数向你的应用提供可配置性。既然配置函数运行在没有服务可用的配置阶段，那么它就连由Value图纸创建的简单值对象都无法访问。

既然简单的值，例如url前缀，并不依赖其他服务或配置，那么使他们在配置和运行阶段都可访问的话，就可以让我们更得心应手一些。这就是Constant图纸存在的意义。

假设在配置阶段提供了发射独角兽的星球名称，那么我们的`unicornLauncher`服务就能通过这个名字来标识一个独角兽。星球名是各个应用特有的，并且在应用运行时也会被各个控制器使用。我们可以像下面的代码那样把星球名定义为一个常量：

```javascript
myApp.constant('planetName', 'Greasy Giant');
```

我们可以像下面那样配置`unicornLauncherProvider`：

```javascript
myApp.config(['unicornLauncherProvider', 'planetName', function(unicornLauncherProvider, planetName) {
  unicornLauncherProvider.useTinfoilShielding(true);
  unicornLauncherProvider.stampText(planetName);
}]);
```
既然Constant图纸使得值像Value图纸创建的服务一样在运行时可访问，那么我们也可以在控制器和模板里使用它：

```javascript
myApp.controller('DemoController', ["clientId", "planetName", function DemoController(clientId, planetName) {
  this.clientId = clientId;
  this.planetName = planetName;
}]);
```

```html
<html ng-app="myApp">
  <body ng-controller="DemoController as demo">
   Client ID: {{demo.clientId}}
   <br>
   Planet Name: {{demo.planetName}}
  </body>
</html>
```


## 专用对象

早先我们也提到过和服务不同的专用对象。这些对象作为插件扩展了Angular框架，因此必须实现Angular指定的接口。这些接口就是控制器，指令，过滤器和动画。

创建这些专用对象（控制器对象除外）的注入器指令幕后其实使用的也是Factory图纸。

现在让我们看看如何通过指令api并基于刚才定义的`planetName`常量来创建一个简单的组件，在我们的例子中：
"Planet Name: Greasy Giant"。
既然指令是通过Factory图纸注册的，那么我们可以使用与工厂方法一致的语法：

```javascript
myApp.directive('myPlanet', ['planetName', function myPlanetDirectiveFactory(planetName) {
  // “指令定义”对象
  return {
    restrict: 'E',
    scope: {},
    link: function($scope, $element) { $element.text('Planet: ' + planetName); }
  }
}]);
```

然后我们可以这样使用这个组件：

```html
<html ng-app="myApp">
  <body>
   <my-planet></my-planet>
  </body>
</html>
```

同样地你可以使用Factory图纸来定义指令和动画，但是控制器要稍微特殊一点。你创建一个控制器作为一个自定义类型，而该自定义类型将它声明的依赖作为构造函数的参数，然后该构造函数在一个模块中注册。让我们看看在先前例子中创建的`DemoController`：

```javascript
myApp.controller('DemoController', ['clientId', function DemoController(clientId) {
  this.clientId = clientId;
}]);
```
每当应用需要一个`DemoController`的实例时，`DemoController`就通过它的构造函数实例化一次（在我们这个简单的应用例子里只被初始化了一次）。因此与各种服务不同，控制器并不是单实例对象。构造函数在被调用时，所有需要的服务实例仍然需要被当作参数传入，在我们例子里是`clientId`服务实例。

## 总结

综上所述，我们总结如下最重要的几点：

- 注入器使用图纸创建两类对象：**服务**和**专用对象**。
- 总共有5类图纸来定义如何创建对象：Value，Factory，Service，Provicer以及Constant。
- Factory和Service是最常用的图纸。它们之间的唯一区别就是Service图纸在创建自定义对象时更适用，而Factory还可以创建Javascript原始类型以及函数。
- Provider图纸是最核心的图纸类型，而其它所有图纸都只是基于它的语法糖。
- Provider也是最复杂的图纸类型，除非你正在构建需要全局配置的可复用代码，否则不要使用它。
- 除了控制器，其他所有**专用对象**都是通过Factory图纸来定义的。

<table class="table table-bordered code-table">
<thead>
<tr>
  <th>特性 / 图纸类型</th>
  <th>Factory</th>
  <th>Service</th>
  <th>Value</th>
  <th>Constant</th>
  <th>Provider</th>
</tr>
</thead>
<tbody>
<tr>
  <td>可以有依赖</td>
  <td class="success">是</td>
  <td class="success">是</td>
  <td class="error">否</td>
  <td class="error">否</td>
  <td class="success">是</td>
</tr>
<tr>
  <td>使用依赖注入友好</td>
  <td class="error">否</td>
  <td class="success">是</td>
  <td class="success">是\*</td>
  <td class="success">是\*</td>
  <td class="error">否</td>
</tr>
<tr>
  <td>对象在配置阶段可访问</td>
  <td class="error">否</td>
  <td class="error">否</td>
  <td class="error">否</td>
  <td class="success">是</td>
  <td class="success">是\*\*</td>
</tr>
<tr>
  <td>可以创建函数/原始类型</td>
  <td class="success">是</td>
  <td class="error">否</td>
  <td class="success">是</td>
  <td class="success">是</td>
  <td class="success">是</td>
</tr>
</tbody>
</table>

\* 有直接使用`new`操作符预先初始化的开销。

\*\* 在配置阶段，服务对象是不能被访问的，但Provider实例是可以被访问的。（参见我们上面列举的`unicornLauncherProvider`例子）。

