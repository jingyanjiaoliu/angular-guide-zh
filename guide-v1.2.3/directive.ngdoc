@ngdoc overview
@name Directives
@description

# 创建自定义指令

<div class="alert alert-warning">
**注意:** 这篇指南是面向那些已经对AngularJS有了基础并比较熟悉的开发者。
如果你是刚开始接触Angular，我们建议你先看看{@link tutorial/ 入门指南}
如果你在寻找**指令API**，请移步这里{@link api/ng.$compile `$compile`}.
</div>


此文解释了在你的AngularJS应用里，何时该创建自定义指令以及如何去实现它们。


## "指令"是什么?

简单点说，指令就是一些附加在HTML元素上的自定义标记（例如：属性，元素，或css类），它告诉AngularJS的**HTML编译器** ({@link api/ng.$compile `$compile`})
在元素上附加某些指定的行为，甚至操作DOM、改变DOM元素，以及它的各级子节点。

Angular内置了一整套指令，如`ngBind`, `ngModel`, 和`ngView`。
就像你可以创建控制器和服务那样，你也可以创建自己的指令来让Angular使用。
当Angular {@link guide/bootstrap 启动器}引导你的应用程序时，
{@link guide/compiler HTML编译器}就会遍历整个DOM，以匹配DOM元素里的指令。

<div class="alert alert-info">
**对于HTML模板来说，"编译"意味着什么?**

对于AngularJS来说，“编译”意味着把监听事件绑定在HTML元素上，使其可以交互。
我们使用"编译"这个术语的原因就在于，把指令关联到DOM上的这种递归操作非常类似于
{@link http://en.wikipedia.org/wiki/Compiled_languages 编译式语言}编译源代码的过程。
</div>


## 指令的匹配

在开始写指令之前，我们需要知道angular的{@link guide/compiler HTML编译器}
是怎样决定该在什么时候调用一个指令的。

在接下来的例子里，我们可以说元素`<input>` **匹配**了`ngModel` 的指令。

```javascript
<input ng-model="foo">
```

下面的语法同样**匹配** `ngModel`:

```javascript
<input data-ng:model="foo">
```

Angular把一个元素的标签和属性名字进行**规范化**，来决定哪个元素匹配哪个指令。
我们通常用区分大小写的**规范化**命名方式(比如`ngModel`)来识别指令。
然而，HTML是大小写不敏感的，所以我们在DOM中使用的指令只能用小写的方式命名，
通常使用{@link http://en.wikipedia.org/wiki/Letter_case#Computers 破折号间隔}的形式(比如：`ng-model`).

**规范化**的过程如下所示：

1. 从元素或属性的名字前面去掉`x-` and `data-`
2. 从`:`, `-`, 或 `_`分隔的形式转换成`小驼峰命名法(camelCase)`.

下面的例子是对于指令`ngBind`的匹配都是等价的:

<example module="docsBindExample">
  <file name="script.js">
    angular.module('docsBindExample', [])
      .controller('Ctrl1', function Ctrl1($scope) {
        $scope.name = 'Max Karl Ernst Ludwig Planck (April 23, 1858 – October 4, 1947)';
      });
  </file>
  <file name="index.html">
    <div ng-controller="Ctrl1">
      Hello <input ng-model='name'> <hr/>
      <span ng-bind="name"></span> <br/>
      <span ng:bind="name"></span> <br/>
      <span ng_bind="name"></span> <br/>
      <span data-ng-bind="name"></span> <br/>
      <span x-ng-bind="name"></span> <br/>
    </div>
  </file>
  <file name="scenario.js">
    it('should show off bindings', function() {
      expect(element('div[ng-controller="Ctrl1"] span[ng-bind]').text())
        .toBe('Max Karl Ernst Ludwig Planck (April 23, 1858 – October 4, 1947)');
    });
  </file>
</example>

<div class="alert alert-success">
**最佳实践:** 建议使用破折号分隔符的方式(比如`ng-bind` for `ngBind`).
如果你想支持HTML验证工具，你可以加前缀`data`.(比如把`ngBind`写成`data-ng-bind`).
其它的形式虽然也是合法的，但都是因为历史遗留原因而支持的，我们建议不要那么用。
</div>

`$compile`(编译) 可以基于元素名字、属性、类名和注释来匹配指令的。Angular提供的所有指令都支持元素名、属性、类名和注释的形式。

下面的例子给出了在模板里引用指令的各种方式：(在这个例子 里是`myDir` ):

```html
<my-dir></my-dir>
<span my-dir="exp"></span>
<!-- directive: my-dir exp -->
<span class="my-dir: exp;"></span>
```

<div class="alert alert-success">
**最佳实践:** 最好通过标签名和属性来使用指令而不要通过注释和类名。这样做可以更容易地看出一个元素是跟哪个指令匹配的。
</div>

<div class="alert alert-success">
**最佳实践:** 通常注释式命名式指令使用在如下情景：某些指令需要跨越多个元素，但是受DOM API的限制，无法跨越多个元素(比如`<table>`元素)。
AngularJS 1.2 引入了{@link api/ng.directive:ngRepeat `ng-repeat-start`和`ng-repeat-end`}指令，作为更好的解决方案。
建议开发者使用这种方式，而不要用“自定义注释”形式的指令。
</div>



### 文本 和 属性 绑定

在编译的过程中{@link api/ng.$compile 编译器}会使用 {@link api/ng.$interpolate $interpolate}服务去匹配文本和属性，以查看它是否含有内嵌的表达式。
这些表达式会作为{@link api/ng.$rootScope.Scope#methods_$watch 监控}的值来注册，
并作为{@link api/ng.$rootScope.Scope#methods_$digest 摘要}循环的一部分来进行实时更新。

下面是展开(interpolation)绑定的一个例子

```html
<a ng-href="img/{{username}}.jpg">Hello {{username}}!</a>
```


### `ngAttr` 属性绑定

Web浏览器有时候对于属性的合法性检查简直是吹毛求疵。

比如，考虑下面的模块：

```html
<svg>
  <circle cx="{{cx}}"></circle>
</svg>
```


使用这样的写法时，我们会发现控制台中报错Error: Invalid value for attribute cx="{{cx}}".
这是由于SVG DOM API的限制，你不能简单的写为cx="{{cx}}".

使用ng-attr-cx 可以解决这个问题

如果一个绑定的属性使用ngAttr前缀(或者ng-attr)进行声明, 那它在绑定的时候就会被应用到相应的未前缀化的属性上，
这种方式允许你绑定到需要马上被浏览器处理的属性上面(比如SVG元素的circle[cx]属性)。

所以，我们可以这样写来修复这个问题:

```html
<svg>
  <circle ng-attr-cx="{{cx}}"></circle>
</svg>
```


## 创建指令

首先先谈一下注册指令API的API。

和控制器一样，指令也是注册在模块上的。
要注册一个指令，你可以用 `module.directive` API。
`module.directive` 接受规范化{@link guide/directive#创建自定义指令_指令的匹配 normalized}
的指令名字和**工厂方法**。此工厂方法应该返回一个带有不同选项的对象来告诉
编译器`$compile`此指令被匹配上该做些什么。

工厂函数仅在 {@link api/ng.$compile 编译器} 第一次匹配到指令的时候调用一次.
你可以在这里进行初始化的工作。
该函数使用{@link api/AUTO.$injector#methods_invoke $injector.invoke}调用，所以它可以像控制器一样进行依赖注入。

<div class="alert alert-success">
**最佳实践:** 尽量返回一个对象，而不要只返回一个函数。
</div>


接下来，我们先会讲解一些常见的例子，然后再深入讲解不同的选项项的原理和编译过程。

<div class="alert alert-success">
**最佳实践:** 为了防止与未来的标准冲突，最好是前缀化你自己的指令名字。
比如你创建一个指令`<carousel>` ，如果HTML7也引入相同的元素它可能会产生冲突。
推荐使用两三个单词的前缀(比如btfCarousel)，同样，不能使用ng或者其他可能与angular未来版本起冲突的前缀。
</div>

下面的例子我们将会使用作为 `my` 前缀 （例如，`myCustomer`）

### 模板扩展指令

当你有大量代表客户信息的模板。这个模板在你的代码中重复了很多次，当你改变一个地方的时候，
你不得不在其他地方同时改动，这时候，你就要使用指令来简化你的模板。

我们来创建一个指令，简单的使用静态模板来替换它的内容。

<example module="docsSimpleDirective">
  <file name="script.js">
    angular.module('docsSimpleDirective', [])
      .controller('Ctrl', function($scope) {
        $scope.customer = {
          name: 'Naomi',
          address: '1600 Amphitheatre'
        };
      })
      .directive('myCustomer', function() {
        return {
          template: '姓名: {{customer.name}} 地址: {{customer.address}}'
        };
      });
  </file>
  <file name="index.html">
    <div ng-controller="Ctrl">
      <div my-customer></div>
    </div>
  </file>
</example>

注意我们在这里做了一些绑定，`$compile` 编译完链接之后，它将会匹配子元素的指令，这意味着你可以组合一些指令。
接下来我们看看下面的{@link guide/directive#创建自定义指令_demo_创建相互通信的指令 例子}是怎样做的

这个例子中，我们直接在`template`选项项里写上模板，但是随着模板大小的增加，这样做非常不优雅。

<div class="alert alert-success">
**最佳实践:** 除非你的模板非常小，否则最好分割成单独的hmtl文件，然后使用`templateUrl`选项来加载。
</div>

如果你熟悉`ngInclude`，那么会发现`templateUrl`的作用与之类似，下面是用`templateUrl`选项的同一个例子：

<example module="docsTemplateUrlDirective">
  <file name="script.js">
    angular.module('docsTemplateUrlDirective', [])
      .controller('Ctrl', function($scope) {
        $scope.customer = {
          name: 'Naomi',
          address: '1600 Amphitheatre'
        };
      })
      .directive('myCustomer', function() {
        return {
          templateUrl: 'my-customer.html'
        };
      });
  </file>
  <file name="index.html">
    <div ng-controller="Ctrl">
      <div my-customer></div>
    </div>
  </file>
  <file name="my-customer.html">
    Name: {{customer.name}} Address: {{customer.address}}
  </file>
</example>

非常好，但是如果我们想让我们的指令匹配标签名呢？ 如果我们只是简单的把元素放在hmtl上面，会发现没有效果。

<div class="alert alert-waring">
**注意:** 创建指令的时候，默认仅使用属性的方式。为了创建一个能由元素名字触发的指令，你需要用到`restrict`选项。
</div>

选项`restrict`可以设置成以下方式：

* `'A'` - 仅匹配属性名
* `'E'` - 仅匹配元素名
* `'AE'` - 既匹配属性名又匹配元素名

下面把例子的restrict选项选项成`restrict: 'E'`。

<example module="docsRestrictDirective">
  <file name="script.js">
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
  </file>

  <file name="index.html">
    <div ng-controller="Ctrl">
      <my-customer></my-customer>
    </div>
  </file>

  <file name="my-customer.html">
    Name: {{customer.name}} Address: {{customer.address}}
  </file>
</example>

restrict属性的详情参阅 {@link api/ng.$compile#description_comprehensive-directive-api_directive-definition-object `restrict`}。
关于指令定义的API文档请参阅 {@link api/ng.$compile#description_comprehensive-directive-api_directive-definition-object API docs}.

<div class="alert alert-info">
**什么情况下该用元素名，什么情况下该用属性名？**

当创建一个含有自己模板的组件的时候，建议使用元素名，常见情况是，当你想为你的模板创建一个DSL（特定领域语言）的时候。如果仅仅想为已有的元素添加功能，建议使用属性名.
</div>

使用元素名做为myCustomer指令是非常正确的决定，因为你不是用一些'customer'行为来装饰这个元素，而是定义一个具有自定义行为的元素作为customer组件

### 给指令一个独立作用域(isolate scope)

上面我们的`myCustomer`指令已经非常好了，但是它有个致命的缺陷，我们在给定的作用域内仅能使用一次。

它现在的实现是，我们每次重用该指令的时候都要为它新创一个控制器.

<example module="docsScopeProblemExample">
  <file name="script.js">
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
  </file>
  <file name="index.html">
    <div ng-controller="NaomiCtrl">
      <my-customer></my-customer>
    </div>
    <hr>
    <div ng-controller="IgorCtrl">
      <my-customer></my-customer>
    </div>
  </file>
  <file name="my-customer.html">
    Name: {{customer.name}} Address: {{customer.address}}
  </file>
</example>

这显然不是一个好的解决方案。

我们想要做的是能够把指令的作用域与外部的作用域隔离开来，然后映射外部的作用域到指令内部的作用域。
可以通过创建**独立作用域(isolate scope)**来达到这个目的。我们可以使用指令的`scope`来选项它:

<example module="docsIsolateScopeDirective">
  <file name="script.js">
    angular.module('docsIsolateScopeDirective', [])
      .controller('Ctrl', function($scope) {
        $scope.naomi = { name: 'Naomi', address: '1600 Amphitheatre' };
        $scope.igor = { name: 'Igor', address: '123 Somewhere' };
      })
      .directive('myCustomer', function() {
        return {
          restrict: 'E',
          scope: {
            customerInfo: '=info'
          },
          templateUrl: 'my-customer-iso.html'
        };
      });
  </file>
  <file name="index.html">
    <div ng-controller="Ctrl">
      <my-customer info="naomi"></my-customer>
      <hr>
      <my-customer info="igor"></my-customer>
    </div>
  </file>
  <file name="my-customer-iso.html">
    Name: {{customerInfo.name}} Address: {{customerInfo.address}}
  </file>
</example>

首先看`index.html`,第一个`<my-customer>` 标签绑定了`naomi`(在控制的作用域[controller's scope]上暴露出来的)值到属性`info`上,
第二个是绑定`igor`到 `info`.

现在看看scope是如何选项的:

```javascript
//...
scope: {
  customerInfo: '=info'
},
//...
```

**作用域选项** 是一组为每个独立作用域绑定的属性组合.在此例子中它只有一个属性：

- 它的名字(`customerInfo`) 对应于指令里的**独立作用域**的`customerInfo`属性.
- 它的值 (`=info`) 告诉`$compile` 这是绑定了所在元素的 `info` 属性。

<div class="alert alert-warning">
**注意:** 指令作用域选项中的'=attr'属性名是被规范化过后的名字.
比如要绑定`<div bind-to-this="thing">`,你就要使用'=bindToThis'的绑定。
</div>

如果属性名和你想要绑定的值的名字一样，你可以使用这样的快捷语法:

```javascript
...
scope: {
  // 等价于'=customer'
  customer: '='
},
...
```

使用独立作用域(isolate scope)还有另外一个用处，那就是可以绑定不同的数据到指令内部的作用域。

在我们的例子中，我们可以添加另外一个属性vojta到我们的作用域，然后在我们的指令模板中访问它。

<example module="docsIsolationExample">
  <file name="script.js">
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
  </file>
  <file name="index.html">
    <div ng-controller="Ctrl">
      <my-customer info="naomi"></my-customer>
    </div>
  </file>
  <file name="my-customer-plus-vojta.html">
    Name: {{customerInfo.name}} Address: {{customerInfo.address}}
    <hr>
    Name: {{vojta.name}} Address: {{vojta.address}}
  </file>
</example>

注意，`{{vojta.name}}`和`{{vojta.address}}` 都是空的，意味着他们是undefined,
虽然我们在控制器中定义了`vojta` ，但是在指令内部访问不到

就像它的名字暗示的一样， 指令的**独立作用域** 隔离了除你添加到`scope: {}`
对象中的数据模型之外的一切东西。这对于你要建立一个可复用的组件来说是非常有用的，
因为它可以阻止除你传入的数据模型之外的一切东西改变你内部数据模型的状态。

<div class="alert alert-warning">
**注意:**普通的作用域都使用原型方式继承自父作用域。但是独立作用域没有这样的继承关系。
</div>

<div class="alert alert-success">
**最佳实践:**如果要使你的组件在应用范围内可重用，那么使用`scope`选项去创建一个独立作用域
</div>


### 创建一个操作DOM的指令

在这个例子中，我们会创建一个显示当前时间的指令，每秒一次更新DOM以正确的显示当前的时间。

指令修改DOM通常是在`link`选项中，`link`选项接受一个带有如下签名的函数`function link(scope,element,attrs) {...}`
其中：
* `scope` 是一个Angular的scope对象.
* `element` 指令匹配的jqLite封装的元素(angular内部实现的类jquery的库)
* `attrs` 是一个带有规范化后属性名字和相应值的对象.

在我们的`link` 函数中，我们每秒更新一次显示时间，当用户改变绑定的时间格式字符串的时候也会更新。
当指令被删除的时候，我们也要移除定时器，以避免引入内存泄露。

<example module="docsTimeDirective">
  <file name="script.js">
    angular.module('docsTimeDirective', [])
      .controller('Ctrl2', function($scope) {
        $scope.format = 'M/d/yy h:mm:ss a';
      })
      .directive('myCurrentTime', function($timeout, dateFilter) {

        function link(scope, element, attrs) {
          var format,
              timeoId;

          function updateTime() {
            element.text(dateFilter(new Date(), format));
          }

          scope.$watch(attrs.myCurrentTime, function(value) {
            format = value;
            updateTime();
          });

          function scheduleUpdate() {
            // save the timeoutId for canceling
            timeoutId = $timeout(function() {
              updateTime(); // update DOM
              scheduleUpdate(); // schedule the next update
            }, 1000);
          }

          element.on('$destroy', function() {
            $timeout.cancel(timeoutId);
          });

          // start the UI update process.
          scheduleUpdate();
        }

        return {
          link: link
        };
      });
  </file>
  <file name="index.html">
    <div ng-controller="Ctrl2">
      Date format: <input ng-model="format"> <hr/>
      Current time is: <span my-current-time="format"></span>
    </div>
  </file>
</example>

这里有很多东西值得注意：
像`module.controller`函数中一样, `module.directive`函数的参数也是通过依赖注入获得的，
因此，我们可以在`link`函数内部使用`$timeout` 和`dateFilter` 服务。

我们注册了一个事件`element.on('$destroy', ...)`, 是什么触发了这个事件呢？

AngularJS会触发一些特定的事件，当一个被angular编译过的DOM元素被移除的时候，
它会触发一个`$destroy` 事件，同样的，当一个angular作用域被移除的时候，
它会向下广播`$destroy` 事件到所有下级作用域。

通过监听事件，你可以移除可能引起内存泄露的事件监听器，
注册在元素和作用域上的监听器在它们被移除的时候，会自动会清理掉，
但是假如注册一个事件在服务或者没有被删除的DOM节点上，你就必须手工清理，否则会有内存泄露的风险。

<div class="alert alert-success">
**最佳实践:** 指令应该自己管理自身分配的内存。当指令被移除时，
你可以使用`element.on('$destroy', ...)` 或 `scope.$on('$destroy', ...)`来执行一个清理的工作。
</div>


### 创建包含其他元素的指令

我们现在已经实现了使用独立作用域传递数据模型到指令里面。
但是有时候我们需要能够传进去整个模板而不是字符串或者对象。
让我们通过创建'dialog box'组件来演示它。这个'dialog box'组件应该能够包裹任意内容。

要想实现这个，我们需要使用`transclude`选项。

<example module="docsTransclusionDirective">
  <file name="script.js">
    angular.module('docsTransclusionDirective', [])
      .controller('Ctrl', function($scope) {
        $scope.name = 'Tobias';
      })
      .directive('myDialog', function() {
        return {
          restrict: 'E',
          transclude: true,
          templateUrl: 'my-dialog.html'
        };
      });
  </file>
  <file name="index.html">
    <div ng-controller="Ctrl">
      <my-dialog>Check out the contents, {{name}}!</my-dialog>
    </div>
  </file>
  <file name="my-dialog.html">
    <div class="alert" ng-transclude>
    </div>
  </file>
</example>

这个`transclude`选项用来干嘛呢？`transclude`使带有这个选项的指令，所包裹的内容能够访问指令**外部**的作用域。

为了说明这个,请看下面的例子。注意，我们在`script.js`增加了一个`link` 函数，
在这个link函数内部我们重定义了name属性的值为Jeff，那么现在这个`{{name}}`会被解析成哪个值呢？

<example module="docsTransclusionExample">
  <file name="script.js">
    angular.module('docsTransclusionExample', [])
      .controller('Ctrl', function($scope) {
        $scope.name = 'Tobias';
      })
      .directive('myDialog', function() {
        return {
          restrict: 'E',
          transclude: true,
          scope: {},
          templateUrl: 'my-dialog.html',
          link: function (scope, element) {
            scope.name = 'Jeff';
          }
        };
      });
  </file>
  <file name="index.html">
    <div ng-controller="Ctrl">
      <my-dialog>Check out the contents, {{name}}!</my-dialog>
    </div>
  </file>
  <file name="my-dialog.html">
    <div class="alert" ng-transclude>
    </div>
  </file>
</example>

一般，我们会认为`{{name}}`会被解析为`Jeff`，然而这里，我们看到这个例子中的`{{name}}` 还是被解析成了`Tobias`.

`transclude` 选项改变了指令相互嵌套的方式，他使指令的**内容**拥有任何指令外部的作用域，
而不是内部的作用域。为了实现这一点，它给了指令内容访问外部作用域的机会。

需要注意的是，如果指令不创建自己的scope(就是说scope:false，或省略)，然后在在link函数里执行
`scope.name = 'Jeff';` 很明显外部的`scope`scope会受影响，因为指令是继续了外部的`scope` ,在输出上会看出 `Jeff`

这样的行为对于包含内容的指令是非常有意义的。因为如果不这样的话，
你就必须分别传入每个你需要使用的数据模型。如果你需要传入每个要使用的数据模型，
那么你就无法做到适应各种不同内容的情况,对吧？

<div class="alert alert-success">
**最佳实践:** 仅当你要创建一个包裹任意内容的指令的时候使用`transclude: true`。
</div>

接下来我们增加一个按钮到'dialog box'组件里面，允许用户使用指令绑定自己定义的行为。

<example module="docsIsoFnBindExample">
  <file name="script.js">
    angular.module('docsIsoFnBindExample', [])
      .controller('Ctrl', function($scope, $timeout) {
        $scope.name = 'Tobias';
        $scope.hideDialog = function () {
          $scope.dialogIsHidden = true;
          $timeout(function () {
            $scope.dialogIsHidden = false;
          }, 2000);
        };
      })
      .directive('myDialog', function() {
        return {
          restrict: 'E',
          transclude: true,
          scope: {
            'close': '&onClose'
          },
          templateUrl: 'my-dialog-close.html'
        };
      });
  </file>
  <file name="index.html">
    <div ng-controller="Ctrl">
      <my-dialog ng-hide="dialogIsHidden" on-close="hideDialog()">
        Check out the contents, {{name}}!
      </my-dialog>
    </div>
  </file>
  <file name="my-dialog-close.html">
    <div class="alert">
      <a href class="close" ng-click="close()">&times;</a>
      <div ng-transclude></div>
    </div>
  </file>
</example>

我们想要通过在指令的作用域上调用我们传进去的函数，但是这个函数本该运行在定义时候的上下文。

先前我们看到如何在`scope`选项中使用`=prop` ，但是在上文的例子中，
我们使用了`&prop` ，`&` 绑定了一个函数到独立作用域，
允许独立作用域调用它，同时保留了原来函数的作用域(这里的作用域都是指$scope)。
所以当一个用户点击`x`时候，就会运行`Ctrl`控制器的`close`函数。

<div class="alert alert-success">
**最佳实践:**  当你的指令想要开放一个API去绑定特定的行为，在`scope`选项中使用`&prop`。
</div>


###创建一个带事件监听器的指令

先前，我们使用`link`函数创建一个操作DOM元素的指令，基于上面的例子，我们创建一个监听元素的事件，以作出相应操作的指令。

比如说，假如我们想要创建一个让用户可拖曳的元素，该怎么做呢？

<example module="dragModule">
  <file name="script.js">
    angular.module('dragModule', []).
      directive('myDraggable', function($document) {
        return function(scope, element, attr) {
          var startX = 0, startY = 0, x = 0, y = 0;

          element.css({
           position: 'relative',
           border: '1px solid red',
           backgroundColor: 'lightgrey',
           cursor: 'pointer'
          });

          element.on('mousedown', function(event) {
            // 组织所选对象的默认拖曳操作
            event.preventDefault();
            startX = event.pageX - x;
            startY = event.pageY - y;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          });

          function mousemove(event) {
            y = event.pageY - startY;
            x = event.pageX - startX;
            element.css({
              top: y + 'px',
              left:  x + 'px'
            });
          }

          function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
          }
        }
      });
  </file>
  <file name="index.html">
    <span my-draggable>Drag ME</span>
  </file>
</example>



### 创建相互通信的指令

你可以通过在模板中使用指令来把任意指令组合起来。有时候，你可能想要一个由一组指令组合组成的组件。

假设你想要一个带有tab的容器，容器的内容对应于当前激活的tab。

<example module="docsTabsExample">
  <file name="script.js">
    angular.module('docsTabsExample', [])
      .directive('myTabs', function() {
        return {
          restrict: 'E',
          transclude: true,
          scope: {},
          controller: function($scope) {
            var panes = $scope.panes = [];

            $scope.select = function(pane) {
              angular.forEach(panes, function(pane) {
                pane.selected = false;
              });
              pane.selected = true;
            };

            this.addPane = function(pane) {
              if (panes.length == 0) {
                $scope.select(pane);
              }
              panes.push(pane);
            };
          },
          templateUrl: 'my-tabs.html'
        };
      })
      .directive('myPane', function() {
        return {
          require: '^myTabs',
          restrict: 'E',
          transclude: true,
          scope: {
            title: '@'
          },
          link: function(scope, element, attrs, tabsCtrl) {
            tabsCtrl.addPane(scope);
          },
          templateUrl: 'my-pane.html'
        };
      });
  </file>
  <file name="index.html">
    <my-tabs>
      <my-pane title="Hello">
        <h4>Hello</h4>
        <p>Lorem ipsum dolor sit amet</p>
      </my-pane>
      <my-pane title="World">
        <h4>World</h4>
        <em>Mauris elementum elementum enim at suscipit.</em>
        <p><a href ng-click="i = i + 1">counter: {{i || 0}}</a></p>
      </my-pane>
    </my-tabs>
  </file>
  <file name="my-tabs.html">
    <div class="tabbable">
      <ul class="nav nav-tabs">
        <li ng-repeat="pane in panes" ng-class="{active:pane.selected}">
          <a href="" ng-click="select(pane)">{{pane.title}}</a>
        </li>
      </ul>
      <div class="tab-content" ng-transclude></div>
    </div>
  </file>
  <file name="my-pane.html">
    <div class="tab-pane" ng-show="selected" ng-transclude>
    </div>
  </file>
</example>

`myPane`指令有一个`require`的选项，其值为:`^myTabs`.，当指令使用这个选项，`$compile`服务会查找一个名叫myTabs的控制器，如果没有找到，就会抛出一个错误。
`^`前缀意味着指令将会在它的父元素上面搜索控制器(如果没有`^`前缀，指令默认只在所属元素上搜索指定的控制器)。

这里`myTabs`的控制器是来自何处呢？简单的通过controller选项就可以为指令定义一个控制器,
比如上面例子中`myTabs` 就使用了这个选项。如`ngController`一样, 此选项把这个控制器绑定到了指令的模板上。

回顾`myPane`的定义，你会注意到link函数的最后一个参数: `tabsCtrl`，
当一个指令需要(require)一个控制器时，它会接收该指令的控制器实例作为`link`函数的第四个参数，
通过它，`myPane`就可以调用`myTabs`的`addPane`函数了。

聪明的读者可能想知道`link` 和 `controller`之间的区别，
最基本的区别就是 `控制器`可以导出一个API，
而子指令的`link`函数可以通过`require`来与这个API交互。

<div class="alert alert-success">
**最佳实践:** 当你想暴露一个API给其它的指令调用那就用`controller`,否则用`link`。
</div>

### 总结

至此我们已经看到了指令的主要使用案例。每一个都可以作为你创建自己指令的很好的起点。

如果你想更深入的了解编译的处理过程，可以查看{@link guide/compiler HTML编译器}。

{@link api/ng.$compile `$compile` API} 页面有directive每个选项项的具体解释，可参阅。
