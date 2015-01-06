define([], function() {
    // ajax
    // 构造一个xmlHttpRequest对象
    var ajax = {};

    ajax.config = {
        header: 'text/plain',
        receiveFormat: 'responseText' // 'responseXML'
    };
    // 创建一个异步对象
    var createXHR = function() {
        return new XMLHttpRequest();
    };
    // 表单数据序列化
    // 注意对数据key和对应的值进行encodeURIComponent
    var serialize = function(data) {

        var props, str = '';
        if (arguments.length === 0) {
            return '';
        }

        for (props in data) {
            if (data.hasOwnProperty(props)) {
                str += encodeURIComponent(props) + '=' + encodeURIComponent(data[props]) + '&';
            }
        }
        return str.slice(0, -1);
    };

    var stateChange = function(xhr, callback) {
        // 异步监听
        // 没有监听步骤，则是同步请求
        xhr.onreadystatechange = function() {
            // 接受数据完毕
            if (xhr.readyState === 4) {
                // 响应成功
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    callback(xhr[ajax.config.receiveFormat]);
                }
            }
        };
    };
    ajax.post = function(url, data, success, asyn) {
        var req = new createXHR();

        if (typeof asyn === undefined) {
            asyn = true;
        }
        var serializeData = serialize(data);
        // open之前调用状态事件
        stateChange(req, success);
        
        req.open('post', url, asyn);
        // 请求头一般不建议在js中写
        // 此处的设置，针对post数据提交为form格式
        // 必须写在open和send中间
        // 否则容易有兼容bug
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(serializeData);


    };

    ajax.get = function(url, data, success, asyn) {
        var req = new createXHR();

        if (typeof asyn === undefined) {
            asyn = true;
        }
        var serializeData = serialize(data);

        stateChange(req, success);
        // 若不是以？结尾，则应当以 &
        url += (url.indexOf('?') === -1 ? '?' : '&');
        req.open('get', url + serializeData, asyn);
        req.send(null);
    };

    ajax.send = function(config) {
        ajax[config.type](config.url, config.data, config.success, config.asyn);
    };

    return ajax;

});
