;(function(factory){
    var Sloth = window['Sloth']||{}
    if(Sloth&&Sloth['Model']){
      Sloth.Model.add(factory);
    }else{
      factory();
    }
  })(function () {
  var Sloth = window['Sloth'] ||{};
  var state = {
    /* 页面传值以及跳转--简单的路由 */
    config: {},
    current: {},
    _isnei: false,
    setConfig: function (option) {
        var type_ = typeof option;
        var that = this;
        if (type_ === 'object') {
            // 获取本页页面名字
            var pathname_ = window.location.pathname;
            var _url = pathname_;
            pathname_ = pathname_.split('/');
            pathname_ = pathname_[pathname_.length - 1];
            var thisPageParamFormat;
            var a = 0;
            /* 写入页面简单路由配置到缓存 */
            for (var key in option) {
                that.config[key] = {
                    template: option[key].template || '',
                    path: option[key].path || '/',
                    paramFormat: option[key].param || '',
                    param: _paramtoJson(option[key].param || '')
                };
                if (that.config[key].path.charAt(that.config[key].path) != '/') {
                    that.config[key].path = that.config[key].path + '/';
                }
                /* 判断当前页面的参数值
                *1。修正深度层级也main判断失败  -v 0.0.3
                */
                if (_url.indexOf(that.config[key].path + that.config[key].template) > -1) {
                    a = 1;
                    that.config['$base_url'] = _url.replace(option[key].path + option[key].template, '');
                    thisPageParamFormat = that.config[key].param;
                    that.current = that.config[key];
                    _getParamFormatJson();
                }
            }
            if (a === 0) {
                if (pathname_ === '' && that.config['default']) {
                    thisPageParamFormat = that.config['default'].param;
                    that.current = that.config['default'];
                    _getParamFormatJson();
                }
                else {
                    Sloth._warn('本页面未设置参数传递！');
                }
            }
        }
        else {
            Sloth._warn(new Error('使用state.setConfig函数去设置页面跳转需要 传入{}对象，而不是' + type_));
        }
        function _paramtoJson(val) {
            var s_ = val.split('/');
            var p_ = [];
            for (var i = 0; i < s_.length; i++) {
                if (s_[i] !== '') {
                    p_.push(s_[i]);
                }
            }
            return p_;
        }
        function _getParamFormatJson() {
            var arry = thisPageParamFormat;
            var hash_ = window.location.hash;
            Sloth._log(pathname_);
            var s_ = hash_.split('/');
            that.current['params'] = {};
            for (var i = 0; i < arry.length; i++) {
                that.params[arry[i]] = s_[i + 1] || '';
                that.current['params'][arry[i]] = s_[i + 1] || '';
            }
        }
        function _hashChangFun() {
            _getParamFormatJson();
            that._function.chang();
            // window.location.reload()
        }
        window.onhashchange = _hashChangFun;
    },
    params: {},
    go: function (url, param, type) {
        // type 'get'是否只会去链接,不去跳转;'go'直接跳转
        type = type || 'go';
        var config = this.config[url];
        param = param || {};
        if (config) {
            var urlStr = '';
            for (var i = 0; i < config.param.length; i++) {
                urlStr += '/' + (param[config.param[i]] != 'undefined' ? param[config.param[i]] : '');
            }
            // 替换 path
            var url_ = this.config['$base_url'] + config.path + config.template + '#' + urlStr;
            if (type === 'go') {
                window.location.href = url_;
            }
            else if (type === 'get') {
                // path
                return window.location.origin + url_;
            }
        }
        else {
            !this._isnei && (Sloth._warn(new Error('您没有设置“' + url + '”这个相关的跳转配置项')));
            if (this._isnei) {
                throw (new Error('您没有设置“' + url + '”这个相关的跳转配置项'));
            }
        }
        this._isnei = false;
    },
    nextpath: function () {
    },
    backViewUrl: function () {
        return document.referrer || '';
    },
    goBack: function () {
        if (this.backViewUrl() === '') {
            _goIndex.call(this);
        }
        else {
            if (this.backViewUrl() === location.href)
                return; // 若是相等就不动了
            if (this.backViewUrl().indexOf(location.host) > 0) {
                window.history.back();
            }
            else {
                _goIndex.call(this);
            }
        }
        function _goIndex() {
            try {
                this._isnei = true;
                var cfg = this.config['index'].param;
                var newPadrm = {};
                for (var i = 0; i < cfg.length; i++) {
                    newPadrm[cfg[i]] = this.params[cfg[i]] || '';
                }
                this.go('index', newPadrm);
            }
            catch (e) {
                Sloth._warn(e);
            }
        }
    },
    _function: {
        chang: function () {
            return false;
        }
    },
    chang: function (fun) {
        this._function.chang = fun;
    }
  }
  Sloth.state = state;
  window['Sloth'] = Sloth;
  return state;
});
