@ngdoc overview
@name Templates
@description

翻译者:[@why520crazy](https://github.com/why520crazy)

Angular的模板是一个声明式的视图，它指定信息从模型、控制器变成用户在浏览器上可以看见的视图。
它把一个静态的DOM —— 只包含HTML，CSS以及Angular添加的标记和属性，然后引导Angular为其加上一些行为和格式转换器，最终变成一个动态的DOM。

在Angular中有以下元素属性可以直接在模板中使用:

* {@link guide/directive 指令(Directive)} — 一个可扩展已有DOM元素或者代表可重复使用的DOM组件，用扩展属性(或者元素)标记。
* {@link api/ng.$interpolate 标记(Expression)} — 用双括号 `{{ }}` 给元素绑定表达式。
* {@link filter 过滤器(Filter)} — 格式化数据显示在界面上。
* {@link forms 表单控件(Form Control)} — 验证用户输入。

注: 除了在模板中声明元素外, 你也可以在JavaScript代码中访问这些元素。

下面的代码片段展示了一个简单的Angular模板，主要由带有({@link guide/directive 指令})的HTML标准标签和`{{}}`{@link expression 表达式}）组成:

```html
<html ng-app>
 <!-- Body标记带有ngController参数  -->
 <body ng-controller="MyController">
   <input ng-model="foo" value="bar">
   <!-- Button标记带有ng-click指令，字符串表达式'buttonText'被包裹在"{{ }}"中 -->
   <button ng-click="changeFoo()">{{buttonText}}</button>
   <script src="angular.js">
 </body>
</html>
```

在一个简单的单页程序中，模板包含HTML，CSS和Angular指令，通常只是一个HTML文件(如 `index.html`)，
在一个更复杂的程序中，你可以在一个主要的页面用"零件(partials)"展示多个视图，这些 "零件(partials)"都是独立的HTML文件，在主页面可以包含(include)
这些"零件(partials)"页面，通过路由 {@link api/ngRoute.$route $route} 和 {@link api/ngRoute.directive:ngView ngView}指令结合，
相关的示例代码参考 {@link tutorial/ angular入门教程} 中的第七，八步骤。


## 相关主题

* {@link filter Angular过滤器}
* {@link forms Angular表单}

## 相关的 API

* {@link api/index API参考手册}

译者注:

  1. 关于模板一定要闭合，着往往是IE上bug的问题所在.
  2. 模板关于IE的兼容性，请参考[ie 兼容性](http://angular.duapp.com/guide/ie)
