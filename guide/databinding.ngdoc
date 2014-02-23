@ngdoc overview
@name 数据绑定
@description
翻译者:[@NigelYao](https://github.com/NigelYao)

在Angular网页应用中，数据绑定是数据模型(model)与视图(view)组件的自动同步。Angular的实现方式允许你把应用中的模型看成单一数据源。而视图始终是数据模型的一种展现形式。当模型改变时，视图就能反映这种改变，反之亦然。

## 典型模板系统中的数据绑定

<img class="right" src="img/One_Way_Data_Binding.png"/>

大多数模板系统中只有单向绑定：它们将模板和数据合并起来加入到视图中去，如图表中所示。合并完成之后，任何对数据模型或者相关内容的改变都不会自动反映到视图中去。更糟的是，用户对视图的任何改变也不会自动同步到数据模型中来。这意味着，开发者需要编写代码来保持视图与模板、模板与视图的同步。

## Angular模板中的数据绑定

<img class="right" src="img/Two_Way_Data_Binding.png"/>

Angular模板的工作方式则不同，如图表中所示。差别体现在：其一，模板（指未经编译的附加了标记和指令的HTML）是在浏览器中编译的。其二，编译阶段生成了动态(live)视图。保持视图动态的原因是，任何视图中的改变都会立刻反映到数据模型中去，任何数据模型的改变都会传播到视图中去。这使得数据模型始终是应用的单一数据源。大幅度简化了开发者的编程核心，你可以将视图简单的理解为数据模型的实时映射。

因此，将视图作为数据模型的一种映射，使得控制器完全与视图分离，而不必关心视图的展现。这使测试变得小菜一碟，你可以在没有视图和有关DOM/浏览器的依赖情况下轻松测试你的应用。

## 相关主题 

* {@link scope Angular Scopes 作用域}
* {@link templates Angular Templates 模板}

译者注:

  1. 关于angular的双向绑定需要理解angular的dirty check.
  2. 双向绑定则引入angular的$watch,一个angular页面理想状况为200左右的$watch，一般大家默认2000$watch为上限(IE),这是为了页面更好的体验效果，而并不意味着一定是angular dirty check上限。
  3. 过多的$watch，我们需要考虑页面的性能，对于表格推荐采用服务端分页,按屏加载[ngInfiniteScroll](http://binarymuse.github.io/ngInfiniteScroll/demo_async.html),以及移除$watch:[angularjs移除不必要的$watch](http://www.cnblogs.com/whitewolf/p/angularjs-remove-unused-watch.html).
