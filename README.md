# Sloth-state.js
## @无声
### Sloth-state.js
由于项目使用其他前端框架编写，没有几个页面，只需要一个页面带参数的跳转，所以就写了这个方法；不依赖任何js；

1/ `Sloth.state.setConfig`

设置各个页面传值和跳转的名字 

 ````
Sloth.state.setConfig({ //'default' 是路由的名字，用来go方法跳转template是页面路径；连接host的绝对路径 param是传值的规格；用'/'分开
 'default': {
    template: 'index.html',
    path: '/',
    param: ''
  },
  'index': {
    template: 'index.html',
    path: '/',
    param: ''
  },
  'foods': {
    template: 'foods.html',
    path: '/',
    param: '/id'
  })
````
2/`Sloth.state.go`

go方法第一个参数是路由名字；第二个是传值； 

`Sloth.state.go('index',{id:1});`

3/`Sloth.state.goBack`

返回上一页 `Sloth.state.goBack();`

4/`Sloth.state.currentPage`

是当前页面的路由的名字；

5/`Sloth.state.params`

获取本页面的hash值接收到的参数 `Sloth.state.params`

6/`Sloth.state.chang`

hash值变化时调用的参数
````
 Sloth.state.chang(function(){ //页面hash值变化时触发事件 });
 ````

7/`Sloth.state.backViewUrl`

返回上一个页面的url `Sloth.state.backViewUrl();`