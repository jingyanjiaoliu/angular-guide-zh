@ngdoc overview
@name 表单(Forms)
@description
翻译者:[@NigelYao](https://github.com/NigelYao)

控件 (`input`, `select`, `textarea`) 是用户输入数据的一种方式。一个表单就是多个控件的集合，用来组织相关的控件。

表单和控件提供验证服务，在用户输入信息有误的时候进行提示。
这提升了用户体验，因为我们在第一时间告知用户什么地方出错了、如何修正错误。
记住，尽管客户端（浏览器）验证在用户体验方面起了重要作用，但是，它很容易被绕过，因此是不能信任的。
为了应用的安全，服务端的验证仍然是必须的。

# 简单的表单

理解双向绑定的关键指令是{@link api/ng.directive:ngModel ngModel}.
指令`ngModel`通过维护“数据到视图”的同步以及“视图到数据”的同步实现了双向绑定。
另外，它还提供了{@link api/ng.directive:ngModel.NgModelController API}来让其他指令扩展其行为。

<example module="formExample">
  <file name="index.html">
    <div ng-controller="ExampleController">
      <form novalidate class="simple-form">
        姓名: <input type="text" ng-model="user.name" /><br />
        E-mail: <input type="email" ng-model="user.email" /><br />
        性别: <input type="radio" ng-model="user.gender" value="male" />男
        <input type="radio" ng-model="user.gender" value="female" />女<br />
        <button ng-click="reset()">重置</button>
        <button ng-click="update(user)">保存</button>
      </form>
      <pre>form = {{user | json}}</pre>
      <pre>master = {{master | json}}</pre>
    </div>

    <script>
      angular.module('formExample', [])
        .controller('ExampleController', ['$scope', function($scope) {
          $scope.master = {};

          $scope.update = function(user) {
            $scope.master = angular.copy(user);
          };

          $scope.reset = function() {
            $scope.user = angular.copy($scope.master);
          };

          $scope.reset();
        }]);
    </script>
  </file>
</example>

其中 `novalidate` 属性用于禁用浏览器自带的表单验证功能。


# 使用 CSS 类

为了允许对表单和控件自定义样式， `ngModel` 增加了如下的CSS类：
- `ng-valid`
- `ng-invalid`
- `ng-pristine`
- `ng-dirty`

接下来的例子中使用这些CSS类来表明每一个表单控件是否有效。
在例子中，`user.name` 和 `user.email` 都是必需的（required），它们仅在成为脏数据(dirty)时才会显示红色背景，但不会在初始状态下（也为空）显示。
这样就防止了用户在尚未与该控件进行交互，而该控件的当前状态恰好不符合验证条件的时候，出现不恰当的错误提示。

<example module="formExample">
  <file name="index.html">
    <div ng-controller="ExampleController">
      <form novalidate class="css-form">
        姓名:
          <input type="text" ng-model="user.name" required /><br />
        E-mail: <input type="email" ng-model="user.email" required /><br />
        性别: <input type="radio" ng-model="user.gender" value="male" />男
        <input type="radio" ng-model="user.gender" value="female" />女<br />
        <button ng-click="reset()">重置</button>
        <button ng-click="update(user)">保存</button>
      </form>
    </div>

    <style type="text/css">
      .css-form input.ng-invalid.ng-dirty {
        background-color: #FA787E;
      }

      .css-form input.ng-valid.ng-dirty {
        background-color: #78FA89;
      }
    </style>

    <script>
      angular.module('formExample', [])
        .controller('ExampleController', ['$scope', function($scope) {
          $scope.master = {};

          $scope.update = function(user) {
            $scope.master = angular.copy(user);
          };

          $scope.reset = function() {
            $scope.user = angular.copy($scope.master);
          };

          $scope.reset();
        }]);
    </script>
  </file>
</example>


# 与表单绑定和控制状态

一个表单是一个 {@link api/ng.directive:form.FormController FormController} 的实例。
这个表单实例可以通过 'name' 属性装载到scope中去。

类似的，一个拥有 {@link api/ng.directive:ngModel} 指令的输入控件，包含一个{@link api/ng.directive:ngModel.NgModelController NgModelController}实例。
这样一个控件的实例可以使用 'name' 属性装载到表单实例中去，作为表单实例的一个字段。name属性指定了其在表单实例中的字段名。

这意味着，在视图中使用基本的数据绑定形式就可以访问到表单和控件中的内部状态。

这让我们可以为上面的例子扩展以下功能：

- 重置按钮 只在表单有改变的时候才可用
- 保存按钮 只在表单有改变且数据有效的时候才可用
- 为 `user.email` 和 `user.agree` 自定义错误提示信息

<example module="formExample">
  <file name="index.html">
    <div ng-controller="ExampleController">
      <form name="form" class="css-form" novalidate>
        姓名:
          <input type="text" ng-model="user.name" name="uName" required /><br />
        E-mail:
          <input type="email" ng-model="user.email" name="uEmail" required/><br />
        <div ng-show="form.uEmail.$dirty && form.uEmail.$invalid">Invalid:
          <span ng-show="form.uEmail.$error.required">Tell us your email.</span>
          <span ng-show="form.uEmail.$error.email">This is not a valid email.</span>
        </div>

        性别: <input type="radio" ng-model="user.gender" value="male" />男
        <input type="radio" ng-model="user.gender" value="female" />女<br />

        <input type="checkbox" ng-model="user.agree" name="userAgree" required />
        我统一: <input ng-show="user.agree" type="text" ng-model="user.agreeSign"
                  required /><br />
        <div ng-show="!user.agree || !user.agreeSign">Please agree and sign.</div>

        <button ng-click="reset()" ng-disabled="isUnchanged(user)">重置</button>
        <button ng-click="update(user)"
                ng-disabled="form.$invalid || isUnchanged(user)">保存</button>
      </form>
    </div>
  </file>

  <file name="script.js">
    angular.module('formExample', [])
      .controller('ExampleController', ['$scope', function($scope) {
        $scope.master = {};

        $scope.update = function(user) {
          $scope.master = angular.copy(user);
        };

        $scope.reset = function() {
          $scope.user = angular.copy($scope.master);
        };

        $scope.isUnchanged = function(user) {
          return angular.equals(user, $scope.master);
        };

        $scope.reset();
      }]);
  </file>
</example>


# 自定义触发器

默认的情况下，对表单所做的任何改变会触发model的更新和表单的验证。你可以通过 {@link ng.directive:ngModelOptions ngModelOptions}指令来覆写此行为，使其只和特定的事件绑定。例如，`ng-model-options="{ updateOn: 'blur' }"`，控件只会在失去焦点的时候才会更新model和验证表单。你可以使用空格来分隔多个事件，组成一个事件列表，如：`ng-model-options="{ updateOn: 'mousedown blur' }"`

如果你希望保留默认的行为，只是想添加新的事件去触发更新和验证，将“default”加入到事件列表中。

例如 `ng-model-options="{ updateOn: 'default blur' }"`

接下来的示例展示了如何覆写即时更新动作。表单中的控件，只会在失去焦点的时候才会去更新model（blur事件）。

<example module="customTriggerExample">
  <file name="index.html">
    <div ng-controller="ExampleController">
      <form>
        姓名:
        <input type="text" ng-model="user.name" ng-model-options="{ updateOn: 'blur' }" /><br />
        其他数据:
        <input type="text" ng-model="user.data" /><br />
      </form>
      <pre>username = "{{user.name}}"</pre>
    </div>
  </file>
  <file name="script.js">
     angular.module('customTriggerExample', [])
      .controller('ExampleController', ['$scope', function($scope) {
        $scope.user = {};
      }]);
  </file>
</example>



# 非即时的（快速响应）数据模型更新

要延迟更新或验证model数据模型，可以在{@link ng.directive:ngModelOptions ngModelOptions}指令中使用'debounced'关键字。延迟同样会应用到解析器、验证器和数据模型标识中，如`$dirty` 和 `$pristine`。

例如，`ng-model-options="{ debounce: 500 }"` 会在数据更新后等待半秒钟，再触发模型更新和表单验证。

如果使用了自定义触发器，可以在 `debounce`中的对象为为每一个事件设置自定义延迟时间。这在某些需要强制立即更新数据模型的情形下会很有用（如blur事件）。

例如 `ng-model-options="{ updateOn: 'default blur', debounce: { default: 500, blur: 0 } }"`

如果这些属性被添加到一个元素中去了，那就会被应用到它所有的子元素和所有继承自它的元素上，除非它们被覆写。

下面的例子展示了如何快速响应数据模型变化。模型在改动后的250毫秒之后就会被更新。

<example module="debounceExample">
  <file name="index.html">
    <div ng-controller="ExampleController">
      <form>
        Name:
        <input type="text" ng-model="user.name" ng-model-options="{ debounce: 250 }" /><br />
      </form>
      <pre>username = "{{user.name}}"</pre>
    </div>
  </file>
  <file name="script.js">
    angular.module('debounceExample', [])
      .controller('ExampleController', ['$scope', function($scope) {
        $scope.user = {};
      }]);
  </file>
</example>


# 自定义验证

Angular提供了一些常用的html5输入控件的验证实现：({@link api/ng.directive:input.text text}, {@link api/ng.directive:input.number number}, {@link api/ng.directive:input.url url}, {@link api/ng.directive:input.email email}, {@link api/ng.directive:input.radio radio}, {@link api/ng.directive:input.checkbox checkbox}), 以及一些用于验证的指令 (`required`, `pattern`, `minlength`, `maxlength`, `min`, `max`).

如果要定义你自己的验证器，可以首先定义一个指令，这个指令给 'ngModel' {@link api/ng.directive:ngModel.NgModelController 控制器}添加了自定义的验证方法。
我们通过指定一个依赖来获得对这个控制器的引用，从下面的例子中可以看出。

验证事件在如下两个情况下触发：

  * **数据到视图的更新** -
    任何时候，受约束的模型改变时，所有在{@link api/ng.directive:ngModel.NgModelController#properties_$formatters NgModelController#$formatters}数组中的方法会被管道式调用（即：一个接一个的调用方法），这样一来，所有的方法都有机会对值来进行格式化并改变表单和控件的有效性状态，这将通过调用{@link api/ng.directive:ngModel.NgModelController#methods_$setValidity NgModelController#$setValidity}来实现。

  * **视图到数据的更新** -
    类似的，当用户与一个控件交互时，调用{@link api/ng.directive:ngModel.NgModelController#methods_$setViewValue NgModelController#$setViewValue}.
    这又反过来管式调用了所有在{@link api/ng.directive:ngModel.NgModelController#properties_$parsers NgModelController#$parsers}数组中的方法，这样一来，所有的方法都有机会对值来进行转换并改变表单和控件的有效性状态，通过{@link api/ng.directive:ngModel.NgModelController#methods_$setValidity NgModelController#$setValidity}来实现。


下面的示例中我们创建了两个指令。

  * 第一个指令是 'integer' 整形数字，它验证了输入是否是一个合法的整形数字。
    例如，'1.23'是一个非法值，因为它包含小数部分。
    注意，我们并没有对数组进行压栈操作，而是插入数组的开头。
    这是因为我们希望指令能成为第一个解析和处理被控制的值，而不希望在我们执行验证前，值已经在其他环节被转换成了数字。
  * 第二个指令是 'smart-float' 智能浮点数。
    它能解析 '1.2' 和 '1,2' 并将其转换成合法的浮点数 '1.2'.
    注意，我们此时不能在HTML5的浏览器中使用 'number' 类型，因为在这种情况下，浏览器不会允许用户输入像 '1,2' 这种被认为是不合法的数字。

<doc:example module="form-example1">
<doc:source>
<div ng-controller="Controller">
  <form name="form" class="css-form" novalidate>
    <div>
      大小 (整数 0 - 10):
      <input type="number" ng-model="size" name="size"
             min="0" max="10" integer />{{size}}<br />
      <span ng-show="form.size.$error.integer">这是无效的数字!</span>
      <span ng-show="form.size.$error.min || form.size.$error.max">
        值必需在0到10之间!</span>
    </div>

    <div>
      长度 (浮点):
      <input type="text" ng-model="length" name="length" smart-float />
      {{length}}<br />
      <span ng-show="form.length.$error.float">
        这是无效的浮点数!</span>
    </div>
  </form>
</div>

<script>
  var app = angular.module('form-example1', []);

  var INTEGER_REGEXP = /^\-?\d+$/;
  app.directive('integer', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          if (INTEGER_REGEXP.test(viewValue)) {
            // 验证通过
            ctrl.$setValidity('integer', true);
            return viewValue;
          } else {
            // 验证不通过 返回 undefined (不会有模型更新)
            ctrl.$setValidity('integer', false);
            return undefined;
          }
        });
      }
    };
  });

  var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
  app.directive('smartFloat', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          if (FLOAT_REGEXP.test(viewValue)) {
            ctrl.$setValidity('float', true);
            return parseFloat(viewValue.replace(',', '.'));
          } else {
            ctrl.$setValidity('float', false);
            return undefined;
          }
        });
      }
    };
  });
</script>
</doc:source>
</doc:example>


# 实现自定义form控件(使用 'ngModel')
Angular实现了所有基本的HTML表单控件(({@link api/ng.directive:input input}, {@link api/ng.directive:select select}, {@link api/ng.directive:textarea textarea})，它们在大多数情况下都很有效。
然而，如果你需要更多的灵活性，你可以使用指令来实现你的自定义表单控件。


为了能让自定义控件能够与'ngModel'正常工作，达到双向绑定的效果，它需要：

  - 实现 '$render' 方法，它负责在数据传递给方法{@link   api/ng.directive:ngModel.NgModelController#properties_$formatters NgModelController#$formatters}之后渲染数据。
  - 调用 '$setViewValue' 方法，在任何用户与控件交互后，模型需要更新的时候调用。这通常在一个DOM事件监听器里完成。

查看 {@link guide/directive $compileProvider.directive} 获得更多的信息。

接下来的例子展示了如何为一个可编辑元素添加双向绑定。

<doc:example module="form-example2">
<doc:source>
<script>
  angular.module('form-example2', []).directive('contenteditable', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        // 视图 -> 模型
        elm.on('blur', function() {
          scope.$apply(function() {
            ctrl.$setViewValue(elm.html());
          });
        });

        // 模型 -> 视图
        ctrl.$render = function() {
          elm.html(ctrl.$viewValue);
        };

        // 从DOM中初始化数据
        ctrl.$setViewValue(elm.html());
      }
    };
  });
</script>

<div contentEditable="true" ng-model="content" title="Click to edit">Some</div>
<pre>model = {{content}}</pre>

<style type="text/css">
  div[contentEditable] {
    cursor: pointer;
    background-color: #D0D0D0;
  }
</style>
</doc:source>
</doc:example>