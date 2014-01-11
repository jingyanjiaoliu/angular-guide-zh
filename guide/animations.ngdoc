@ngdoc overview
@name Developer Guide: Animations
@description


# 动画

AngularJS 1.2为部分常见的指令提供了动画钩子，比如 `ngRepeat`, `ngSwitch` 和 `ngView`, 而自定义指令则可以通过`$animate`服务来实现。这些动画钩子在各种指令的生命周期内触发，触发时，它会尝试执行 CSS过渡动画（Transition）, CSS关键帧动画（Keyframe Animation）或JavaScript回调动画（callback Animation）（取决于指令中的设定)。动画包括根据AngularJS内置的命名约定定义的CSS原生动画（包括过渡动画和关键帧动画），或者通过工厂(Factory)定义的JavaScript回调动画。

要想使用动画，必须单独引入{@link api/ngAnimate `ngAnimate`模块}，angular.js中没有内置它。

下面便是一个通过 `ngShow` 和 `ngHide` 指令使用动画的一个简单例子:

<example animations="true">
  <file name="index.html">
    <div ng-init="checked=true">
      <label>
        <input type="checkbox" ng-model="checked" style="float:left; margin-right:10px;"> 可见...
      </label>
      <div class="check-element animate-show-hide" ng-show="checked" style="clear:both;">
        可见...
      </div>
    </div>
  </file>
  <file name="animations.css">
    .animate-show-hide {
      padding:10px;
      border:1px solid black;
      background:white;
    }

    .animate-show-hide.ng-hide-add, .animate-show-hide.ng-hide-remove {
      -webkit-transition:all linear 0.5s;
      -moz-transition:all linear 0.5s;
      -o-transition:all linear 0.5s;
      transition:all linear 0.5s;
      display:block!important;
    }

    .animate-show-hide.ng-hide-add.ng-hide-add-active,
    .animate-show-hide.ng-hide-remove {
      opacity:0;
    }

    .animate-show-hide.ng-hide-add,
    .animate-show-hide.ng-hide-remove.ng-hide-remove-active {
      opacity:1;
    }
  </file>
</example>

## 使用

有关该模块的详细说明，请参见{@link api/ngAnimate `ngAnimate` API文档 }


你或许应该把这些CSS动画定义在一个单独的CSS文件中。

## 如何工作

AngularJS的动画完全基于CSS class来工作。只要在你网页中的HTML元素加上了特定的class，你就得到了动画效果。让我们看一个在ng-repeat中使用动画的例子:

<pre>
<div ng-repeat="item in items" class="repeated-item">
  {{ item.id }}
</div>
</pre>

如上所示，ng-repeat所在的元素上有一个`.repeated-item`类，这个类名将被CSS原生动画和/或JavaScript动画代码在定义动画时所引用。

当每次ngRepeat中新增一个条目(item)时, ngRepeat会在该条目上自动添加一个`ng-enter`类，每次移除条目时会添加`ng-leave`类，每次条目被移动时会添加`ng-move`类。

下面的CSS代码中, 我们可以看到每一个ngRepeat触发的事件,设置transition以及animation动画代码：

<pre>
&#47;&#42;
  我们使用CSS过渡(transition)语句来为带有.repeated-item类的元素添加动画效果，他们将在各个条目新增和移动时触发。
&#42;&#47;
.repeated-item.ng-enter, .repeated-item.ng-move {
  -webkit-transition:0.5s linear all;
  -moz-transition:0.5s linear all;
  -o-transition:0.5s linear all;
  transition:0.5s linear all;
  opacity:0;
}

&#47;&#42;
 用ng-enter-active和ng-move-active类来定义过渡效果的最终属性值，以便动画指令知道它最终该达到什么状态。
&#42;&#47;
.repeated-item.ng-enter.ng-enter-active,
.repeated-item.ng-move.ng-move-active {
  opacity:1;
}

&#47;&#42;
  我们使用CSS关键帧(keyframe animation)语句来为带有.repeated-item类的元素定义移除动画(ng-leave)
&#42;&#47;
.repeated-item.ng-leave {
  -webkit-animation:0.5s my_animation;
  -moz-animation:0.5s my_animation;
  -o-animation:0.5s my_animation;
  animation:0.5s my_animation;
}

&#64;keyframes my_animation {
  from { opacity:1; }
  to { opacity:0; }
}

&#47;&#42;
  不幸的是，每个浏览器都需要用它自己的“方言”来定义关键帧动画
&#42;&#47;
&#64;-webkit-keyframes my_animation {
  from { opacity:1; }
  to { opacity:0; }
}

&#64;-moz-keyframes my_animation {
  from { opacity:1; }
  to { opacity:0; }
}

&#64;-o-keyframes my_animation {
  from { opacity:1; }
  to { opacity:0; }
}
</pre>

同样的方法也可用于JavaScript动画 (**用jQuery来执行动画**):

<pre>
myModule.animation('.repeated-item', function() {
  return {
    enter : function(element, done) {
      element.css('opacity',0);
      jQuery(element).animate({
        opacity: 1
      }, done);

      // 可选的onDone或onCancel回调函数可用于定义执行完动画后的各种清理操作。
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },
    leave : function(element, done) {
      element.css('opacity', 1);
      jQuery(element).animate({
        opacity: 0
      }, done);

      // 可选的onDone或onCancel回调函数可用于定义执行完动画后的各种清理操作。
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },
    move : function(element, done) {
      element.css('opacity', 0);
      jQuery(element).animate({
        opacity: 1
      }, done);

      // 可选的onDone或onCancel回调函数可用于定义执行完动画后的各种清理操作。
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },

    // 你还可以捕获下列动画事件
    addClass : function(element, className, done) {},
    removeClass : function(element, className, done) {}
  }
});
</pre>

一旦这些类名出现在元素上，AngularJS就知道该执行CSS或JavaScript动画了。 如果同时定义了CSS动画和JavaScript动画，并且匹配了这些类名，AngularJS就会同时执行它们。

## Class 与 ngClass 动画钩子

AngularJS也通过设置**add**和**remove**钩子来关注类名的变化。这意味着如果从一个元素中增加或者删除一个CSS类，动画会在这个类名被添加或者删除完毕之前就开始执行。(记住：即使元素上使用了**{{}}表达式**或者**ng-class**指令，AngularJS也只能捕获到类名的变化。)

下面的例子演示了如何在类名变化时执行动画：

<example animations="true">
 <file name="index.html">
  <p>
    <input type="button" value="设置" ng-click="myCssVar='css-class'">
    <input type="button" value="清除" ng-click="myCssVar=''">
    <br>
    <span ng-class="myCssVar">CSS-动画文本</span>
  </p>
 </file>
 <file name="style.css">
   .css-class-add, .css-class-remove {
     -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
     -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
     -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
     transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
   }

   .css-class,
   .css-class-add.css-class-add-active {
     color: red;
     font-size:3em;
   }

   .css-class-remove.css-class-remove-active {
     font-size:1.0em;
     color:black;
   }
 </file>
</example>

虽然这里的CSS与我们之前看到的有点区别，但思想是一样的。

## 哪些指令支持动画呢？

部分AngularJS指令支持在它的生命周期内发生重要事件时触发动画钩子，下面的表格详细说明了哪些动画事件会被触发。

| Directive                                                                           | 支持动画                     |
|-------------------------------------------------------------------------------------|------------------------------------------|
| {@link api/ng.directive:ngRepeat#usage_animations ngRepeat}                               | enter , leave , move                   |
| {@link api/ngRoute.directive:ngView#usage_animations ngView}                              | enter , leave                          |
| {@link api/ng.directive:ngInclude#usage_animations ngInclude}                             | enter ,  leave                          |
| {@link api/ng.directive:ngSwitch#usage_animations ngSwitch}                               | enter ,  leave                          |
| {@link api/ng.directive:ngIf#usage_animations ngIf}                                       | enter ,  leave                          |
| {@link api/ng.directive:ngShow#usage_animations ngClass or &#123;&#123;class&#125;&#125;} | add , remove                           |
| {@link api/ng.directive:ngShow#usage_animations ngShow & ngHide}                          | add , remove (the ng-hide class value) |

对于各个动画事件的详细触发步骤，请参考{@link api/ngAnimate.$animate API 文档}。

## 怎样在我们自己的指令中使用动画呢？

在自定义指令中你可以通过依赖注入获得`$animate`服务, 你可以在任何需要的时候调用它。

<pre>
myModule.directive('my-directive', ['$animate', function($animate) {
  return function(element, scope, attrs) {
    element.bind('click', function() {
      if(element.hasClass('clicked')) {
        $animate.removeClass(element, 'clicked');
      } else {
        $animate.addClass(element, 'clicked');
      }
    });
  };
}]);
</pre>

## 关于动画的更多知识

关于`$animate`各个方法的详情, 请参阅 {@link api/ngAnimate.$animate API 文档}。

查看完整demo，请参见{@link tutorial/step_12 “AngularJS phonecat向导”之“动画”一节}。
