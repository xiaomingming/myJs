// dom ready实现
// 参考百度 tangram
// 另外参考：https://github.com/addyosmani/jquery.parts/blob/master/jquery.documentReady.js
define([], function() {
    var ready = function() {
        var readyBound = false,
            readyList = [],
            DOMContentLoaded;

        if (document.addEventListener) {
            // 定义一个dom载入完成函数
            DOMContentLoaded = function() {
                document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false); //立即解绑
                ready();
            };

        } else if (document.attachEvent) {
            DOMContentLoaded = function() {
                if (document.readyState === 'complete') {
                    document.detachEvent('onreadystatechange', DOMContentLoaded);
                    ready();
                }
            };
        }
        /**
         * @private
         */

        function ready() {
            if (!ready.isReady) {
                ready.isReady = true;
                for (var i = 0, j = readyList.length; i < j; i++) {
                    readyList[i]();
                }
            }
        }
        /**
         * @private
         */

        function doScrollCheck() {
            try {
                document.documentElement.doScroll('left');
            } catch (e) {
                setTimeout(doScrollCheck, 1);
                return;
            }
            ready();
        }

        function bindReady() {
            if (readyBound) {
                return;
            }
            readyBound = true;

            if (document.readyState === 'complete') {
                ready.isReady = true;
            } else {
                if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
                    window.addEventListener('load', ready, false);
                } else if (document.attachEvent) {
                    document.attachEvent('onreadystatechange', DOMContentLoaded); //只执行一次回调
                    window.attachEvent('onload', ready);

                    var toplevel = false;

                    try {
                        toplevel = window.frameElement === null;
                    } catch (e) {}

                    if (document.documentElement.doScroll && toplevel) {
                        doScrollCheck();
                    }
                }
            }
        }
        bindReady();

        return function(callback) {
            ready.isReady ? callback() : readyList.push(callback);
        };
    }();

    ready.isReady = false;
    return ready;
});
