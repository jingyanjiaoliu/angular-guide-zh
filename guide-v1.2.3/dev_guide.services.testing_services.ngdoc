@ngdoc overview
@name 开发指南: Angular服务: 测试Angular服务
@description

翻译者：[@asnowwolf](https://github.com/asnowwolf)

下面是一个关于{@link
dev_guide.services.creating_services 创建Angular服务}那章的范例中所创建的`notify`服务的单元测试。这个单元测试用Jasmine的spy(mock)对象来代替实际浏览器，以拦截它的alert函数。


<pre>
var mock, notify;

beforeEach(function() {
  mock = {alert: jasmine.createSpy()};

  module(function($provide) {
    $provide.value('$window', mock);
  });

  inject(function($injector) {
    notify = $injector.get('notify');
  });
});

it('对第一次和第二次通知，不应该有警告', function() {
  notify('one');
  notify('two');

  expect(mock.alert).not.toHaveBeenCalled();
});

it('对第三次及以后的通知，都要给出警告', function() {
  notify('one');
  notify('two');
  notify('three');

  expect(mock.alert).toHaveBeenCalledWith("one\ntwo\nthree");
});

it('给出警告之后，要清除消息', function() {
  notify('one');
  notify('two');
  notify('third');
  notify('more');
  notify('two');
  notify('third');

  expect(mock.alert.callCount).toEqual(2);
  expect(mock.alert.mostRecentCall.args).toEqual(["more\ntwo\nthird"]);
});
</pre>


## 相关主题

* {@link dev_guide.services.understanding_services 理解Angular服务}
* {@link dev_guide.services.creating_services 创建Angular服务}
* {@link dev_guide.services.managing_dependencies 管理服务依赖}
* {@link dev_guide.services.injecting_controllers 把服务注入到控制器中}

## 相关API

* {@link api/ng Angular服务API}
