define([], function() {
    /*
     * 工具函数
     */
    var Utils = {};
    Utils.error = function(msg) {
        throw new Error(msg);
    };
    Utils.trim = function(str) {
        return str.trim() || str.replace(/(^\s+)|(\s+$)/g, '');
    };
    Utils.trimLeft = function(str) {
        return str.trimLeft() || str.replace(/(^\s+)/g, '');
    };
    Utils.trimRight = function(str) {
        return str.trimRight() || str.replace(/(\s+$)/g, '');
    };
    // 伪数组转化成数组
    Utils.makeArray = function(obj) {
        // 对于函数或者对象，应当返回[]
        if (!obj || obj.length === 0 || this.isType(obj, 'object') || this.isType(obj, 'function')) {
            return [];
        }
        // 非伪类对象，直接返回最好
        if (!obj.length) {
            return obj;
        }
        // 针对IE8以前 DOM的COM实现
        try {
            return [].slice.call(obj);
        } catch (e) {
            var i = 0,
                j = obj.length,
                res = [];
            for (; i < j; i++) {
                res.push(obj[i]);
            }
            return res;
        }

    };
    // 数组插入
    Utils.pushArr = function(arr1, arr2) {
        [].push.apply(arr1, arr2);
        return arr1;
    };
    // 是否为数字
    Utils.isNumber = function(num) {
        return !isNaN(num) && isFinite(num);
    };
    // 数组项随机获取
    Utils.randomArr = function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };
    // 生成随机数字字符组合串
    Utils.randomAlphaNum = function(len) {
        var rdmStr = '',
            i = 0;
        for (; rdmStr.length < len; i++) {
            rdmStr += Math.random().toString(36).substring(2);
        }
        return rdmStr.substring(0, len);
    };
    // 生成某个范围内的随机数
    Utils.rangeNum = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    // 随机排序
    Utils.shuffleArr = function(arr) {
        return arr.sort(function() {
            return Math.random() - 0.5;
        });
    };
    // 去重
    Utils.distinctArr = function(arr) {
        // html去重和数组去重不同，单层循环搞不定啊
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] === arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    };
    // 判断是否为一个DOM集合
    Utils.isDomArr = function(ele) {
        return !ele.length ? false : true;
    };
    // 是否为你期待的数据类型
    // IE对于function判断的bug，暂时不做修复
    // 参考详见：http://www.planabc.net/2010/01/23/repair_the_bug_of_isfunction_method_in_jquery/
    Utils.isType = function(data, type) {
        return (type === 'null' && type === null) || (type === 'undefined' && type === undefined) || Object.prototype.toString.call(data).slice(8, -1).toLowerCase() === type;
    };
    // 扩展函数
    // 对象拷贝
    // 不支持深拷贝
    Utils.extend = function(defaults) {
        var result = {},
            key, key1, source, i = 0,
            j = arguments.length;
        for (key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                result[key] = defaults[key];
            }
        }
        for (; i < j; i++) {
            source = arguments[i];
            for (key1 in source) {
                if (source.hasOwnProperty(key1)) {
                    result[key1] = source[key1];
                }
            }
        }

        return result;
    };
    // 遍历数组和对象
    Utils.each = function(obj, callback) {
        if (this.isType(obj, 'object')) {
            // 对象
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    callback.call(null, key, obj[key]);
                }
            }
        } else if (this.isType(obj, 'array') || this.isType(obj, 'nodeList')) {
            // 数组
            // 你想不到的是，nodelist类型
            for (var i = 0, j = obj.length; i < j; i++) {
                callback.call(null, i, obj[i]);
            }
        }
    };
    // 函数柯里化
    Utils.curry = function(fn) {
        var args = [].slice.call(arguments, 1);
        return function() {
            args = args.concat([].slice.call(arguments));
            return fn.call(null, args);
        };
    };
    // 执行一次回调函数
    // 但是，并不销毁该函数
    Utils.once = function(fn) {
        var flag = false,
            args = [].slice.call(arguments, 1);

        return function() {
            if (!flag) {
                args = args.concat([].slice.call(arguments));
                flag = true;
                return fn.apply(null, args);
                // /fn = null;
            }
            return undefined;
        };
    };
    // 判断一个对象是否为空
    Utils.isEmptyObj = function(obj) {
        var props;
        for (props in obj) {
            if (obj.hasOwnProperty(props)) {
                return false;
            }

        }
        return true;
    };
    // 以下三个函数不可以为工具函数
    // 有待整理
    Utils.isWindow = function(obj) {
        return obj !== null && obj === obj.window;
    };
    Utils.getWindow = function(elem) {
        return this.isWindow(elem) ?
            elem :
            elem.nodeType === 9 ?
            elem.defaultView || elem.parentWindow :
            false;
    };
    return Utils;
});
