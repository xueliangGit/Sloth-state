;(function(){
  var Sloth=Sloth||{};
  Sloth.state={
        /*页面传值以及跳转--简单的路由*/
        config:{},//缓存数值
        _isnei:false,
        setConfig:function(option){
          var type_=typeof option;
          var that=this;
            if(type_ =='object'){
              //获取本页页面名字
               var pathname_=window.location.pathname;
              pathname_=pathname_.split('/');
              pathname_=pathname_[pathname_.length-1];
              var thisPageParamFormat,a=0;
              /*写入页面简单路由配置到缓存*/
              for(var key in option){
                  that.config[key]={
                    template:option[key].template||'',
                    paramFormat:option[key].param||'',
                    param:_paramtoJson(option[key].param||''),
                  };
                  /*判断当前页面的参数值*/
                  if(pathname_==option[key].template){
                    a=1;
                    thisPageParamFormat=that.config[key].param;
                    _getParamFormatJson();
                  }
              }
              if(a===0){warn('本页面为设置参数传递！');}
            }else{
              warn(new Error('使用state.setConfig函数去设置页面跳转需要 传入{}对象，而不是'+type_));
            }
            function _paramtoJson(val){
              var s_=val.split('\/');
              var p_=[];
              for (var i=0;i<s_.length;i++){
                if(s_[i]!==''){
                    p_.push(s_[i]);
                }
              }
              return p_;
            }
            function _getParamFormatJson(){
              var arry=thisPageParamFormat;
              var hash_=window.location.hash;
              log(pathname_);
                var s_=hash_.split('/');
                for(var i=0;i<arry.length;i++){
                    that.params[arry[i]]=s_[i+1]||'';
                }
            }
            function _hashChangFun(){
              _getParamFormatJson();
              that._function.chang();
              //window.location.reload();
            }
           window.onhashchange = _hashChangFun;
        },
        params:{},
        go:function(url,param){
          var config=this.config[url];
          param=param||{};
          if(config){
            var url_str='';
            for(var i=0;i<config.param.length;i++){
                 url_str+='/'+param[config.param[i]]||'';
            }
           var url_=config.template+'#'+url_str;
             window.location.href=url_;
          }else{
            !this._isnei&&(warn(new Error('您没有设置“'+url+'”这个相关的跳转配置项')));
            if(this._isnei){
              throw(new Error('您没有设置“'+url+'”这个相关的跳转配置项'));
            }
          }
          this._isnei=false;
        },
        backViewUrl:function(){
          return document.referrer||'';
        },
        goBack:function(){//返回上一页
          if(this.backViewUrl()===''){
              _goIndex.call(this);
          }else{
            if(this.backViewUrl()==location.href)return;//若是相等就不动了
            if(this.backViewUrl().indexOf(location.host)>0){//若是统一域名就普通返回
              window.history.back();
            }else{//若不是是统一域名，就返回到index页，其中参数的传递，会吧本页的参数进行过滤，含有首页的参数，会带到首页；
              _goIndex.call(this);
            }
          }
          function _goIndex(){
            try{
                this._isnei=true;
                var cfg=this.config['index'].param;
                var newPadrm={};
                for(var i=0;i<cfg.length;i++){
                    newPadrm[cfg[i]]=this.params[cfg[i]]||'';
                }
                this.go('index',newPadrm);
              }catch(e){
                warn(e);
              }
          }
        },
        _function:{
          chang:function(){
            return ;
          }
        },
        chang:function(fun){
          this._function.chang=fun;
        }
      };
})();
/********************************页面传值配置*****************************
1/Sloth.state.setConfig
设置各个页面传值和跳转的名字
Sloth.state.setConfig({
 //'default' 是路由的名字，用来go方法跳转
 template是页面路径；连接host的绝对路径
 param是传值的规格；用'/'分开
  'default':{
    template:'',
    param:'/pid'
  },
  'index':{
    template:'',
    param:'/id
  }
});

2/Sloth.state.go
go方法第一个参数是路由名字；第二个是传值；
Sloth.state.go('index',{id:1});

3/Sloth.state.goBack
返回上一页；
Sloth.state.goBack();

4/Fun.state.currentPage
是当前页面的路由的名字；
5/Fun.state.params
获取本页面的hash值接收到的参数
6/Fun.state.chang
hash值变化时调用的参数
Fun.state.chang(function(){
 //页面hash值变化时触发事件
});
7/Fun.state.backViewUrl
返回上一个页面的url
Fun.state.backViewUrl();
  **/