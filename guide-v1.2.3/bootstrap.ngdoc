@ngdoc overview
@name Developer Guide: Bootstrap
@description

Translated by [@GrahamLe](https://github.com/grahamle)

# 概述

这一章讲述 Angular 初始化过程以及必要的时候用户如何能够手动将 Angular 初始化。

## Angular `<script>` 标签

下面例子展示了推荐的在应用中使用 Angular 的自动初始化的代码路径设置。

<pre>
<!doctype html>
<html xmlns:ng="http://angularjs.org" ng-app>
  <body>
    ...
    <script src="angular.js">
  </body>
</html>
</pre>

  * 在HTML页面底部放置 `script` 标签。这样可以优化应用的加载时间，因为避免了HTML加载时被 `angular.js` 脚步的加载阻滞。你可以在在这里 {@link http://code.angularjs.org} 获取 Angular 的最新版本。注意，别再你的产品代码中连接这个 URL，因为这样会在你的网站中暴露一个安全问题。当然，在开发的时候连接是没有问题的。
    * 选择 `angular-[version].js` 这样一个可读的版本，用来作为开发和调试用
    * 选择 `angular-[version].min.js` 这样一个压缩版本，用来作为产品发布时用
  * 如果你想要你的应用自动启动 Angular 的话，那就把 `ng-app` 放在应用的根结点中，通常情况下是 `<html>` 标签中，像下面这样：

        <html ng-app>

  * 如果你的应用需要支持 IE7 ，那么加上 `id="ng-app"`

        <html ng-app id="ng-app">

  * 如果你要使用 `ng:` 这样的老风格的指令方式，那就在 `html` 中加入 `xml命名空间` ，这样也能让 IE 得瑟下。（译注：历史原因，你懂的，所以 `ng:` 这种方式现在已经不推荐了。

        <html xmlns:ng="http://angularjs.org">

## 自动初始化

<img class="pull-right" style="padding-left: 3em;" src="img/guide/concepts-startup.png">

Angular 在以下两种情况下自动初始化，一个是在 `DOMContentLoaded` 事件触发时，或者在 `angular.js` 脚本被执行的同时如果 `document.readyState` 被置为 `'complete'` 的话。初始化时，Angular 会去找 {@link api/ng.directive:ngApp `ng-app`} 这个指明应用开始所在的指令。如果 {@link api/ng.directive:ngApp `ng-app`} 指令被找到的话，Angular 会做以下几件事：

  * 加载 `ng-app` 指令所指定的 {@link guide/module 模块}
  * 创建应用所需的 {@link api/AUTO.$injector injector}
  * 以 {@link api/ng.directive:ngApp `ng-app`} 所在的节点为根节点，开始遍历并编译DOM树（`ng-app` 指出了应用的哪一部份开始时 Angular 去编译的）

<pre>
<!doctype html>
<html ng-app="optionalModuleName">
  <body>
    I can add: {{ 1+2 }}.
    <script src="angular.js"></script>
  </body>
</html>
</pre>

## 手动初始化

如果你想在初始化阶段拥有更多的控制权，你可以使用手动方法启动应用。你需要手动启动的可能会是你想要在你的应用中使用脚本加载器，或者你可能想要在 Angular 编译页面之前执行一些别的操作。

下面是一个手动初始化 Angular 的例子：

<pre>
<!doctype html>
<html xmlns:ng="http://angularjs.org">
  <body>
    Hello {{'World'}}!
    <script src="http://code.angularjs.org/angular.js"></script>
    <script>
       angular.element(document).ready(function() {
         angular.module('myApp', []);
         angular.bootstrap(document, ['myApp']);
       });
    </script>
  </body>
</html>
</pre>

注意，在上面的例子中，我们提供了我们应用要加载的模块名作为 {@link api/angular.bootstrap} 函数的第二个参数。需要注意的是 `angular.bootstrap` 不会凭空创建模块，在我们将模块作为参数注入之前，必须创建任一自定义的 {@link guide/module 模块}。

以下是你的 Angular 代码运行时遵循的顺序：

  1. 在HTML页面以及所有代码加载完毕后，Angular 会去找到应用的根元素（通常是文档的根节点）

  2. 调用 {@link api/angular.bootstrap} 去 {@link compiler 编译} 各元素成为一个可执行的且双向绑定的应用

## 延迟启动

这个特色可以让像 Batarang 一样的测试工具横插一杠进入 Angular 的引导进程，并且溜进模块中的DI注册机制中，这样就可以替换或者增强DI提供的服务。（译注：由于后面一句不甚理解其原理，不敢贸然翻译）

当 {@link api/angular.bootstrap} 被调用时，如果 `window.name` 包含 `NG_DEFER_BOOTSTRAP!` 前缀，引导进程会被暂停直到 `angular.resumeBootstrap()` 被调用。

`angular.resumeBootstrap()` 以一个可选的数组作为参数。这个数组是包含了应用启动时需要被注入的模块。
