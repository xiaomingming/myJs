define(['knife', 'dom'], function(tools, D) {
    var E = {};
    // 添加事件
    E.addEvent = (function() {
        if (document.addEventListener) {
            return function(ele, evType, handler) {
                if (tools.isDomArr(ele)) {
                    tools.each(ele, function(i, v) {
                        v.addEventListener(evType, function(e) {
                            handler(e);
                        }, false);
                    });
                } else {
                    ele.addEventListener(evType, function(e) {
                        handler(e);
                    }, false);
                }
            };
        } else if (document.attachEvent) {
            return function(ele, evType, handler) {
                if (tools.isDomArr(ele)) {
                    tools.each(ele, function(i, v) {
                        v.attachEvent('on' + evType, function() {
                            handler.call(v, window.event);
                        });
                    });
                } else {
                    ele.attachEvent('on' + evType, function() {
                        handler.call(ele, window.event);
                    });
                }
            };
        }
    })();

    // 移除事件
    E.removeEvent = (function() {
        if (document.removeEventListener) {
            return function(ele, evType, handler) {
                if (tools.isDomArr(ele)) {
                    tools.each(ele, function(i, v) {
                        v.removeEventListener(evType, handler, false);
                    });
                } else {
                    ele.removeEventListener(evType, handler, false);
                }

            };
        } else if (document.detachEvent) {
            return function(ele, evType, handler) {
                if (tools.isDomArr(ele)) {
                    tools.each(ele, function(i, v) {
                        v.detachEvent('on' + evType, handler);
                    });
                } else {
                    ele.detachEvent('on' + evType, handler);
                }
            };
        }
    })();
    // 获取事件
    E.getEvent = function(event) {
        return event || window.event;
    };
    // 获取事件对象
    E.getTarget = function(event) {
        return E.getEvent(event).target || E.getEvent(event).srcElement;
    };
    // 获取相关事件对象
    // IE8 将其保存在event.fromElement(mouseover)和event.toElement(out)属性中
    E.getRelatedTarget = function(event) {
        var evt = E.getEvent(event);
        return evt.relatedTarget || evt.fromElement || evt.toElement || null;
    };
    // keyCode IE8 及opera support
    E.getKeyCode = function(e) {
        e = E.getEvent(e);
        if (typeof e.charCode === 'number') {
            return e.charCode;
        } else {
            return e.keyCode;
        }
    };
    // 事件委托
    // 事件类型，委托的父元素，事件目标字符串，回调
    // 事件目标字符串只支持html tag，class，id
    E.delegate = function(eType, context, target, fn) {
        var self = this,
            tag = '',
            className = '',
            sArr = target.split('.');

        // 此处针对target做一个处理
        // 只允许传入标签和类
        // li.item .item1.item2 li div

        context = D.$(context);

        self.addEvent(context, eType, function(e) {
            e = self.getEvent(e);
            var eTarget = self.getTarget(e);

            var eTag = eTarget.tagName.toLowerCase(),
                eCName = eTarget.className;

            var i = 0,
                j = 0,
                reg;
            if (/\./.test(target)) {
                className = sArr.slice(1);

                for (i = 0, j = className.length; i < j; i++) {
                    reg = new RegExp('(^|\\s)' + className[i] + '(\\s|$)');
                    if (!reg.test(eCName)) {
                        return false;
                    }

                }
                if (target.charAt(0) !== '.') {
                    // 标签混合
                    tag = sArr[0];
                    if (eTag === tag) {
                        fn(e);
                    }
                } else {
                    fn(e);
                }
            } else {
                if (eTag === target) {
                    fn(e);
                }
            }
        });
    };
    // 鼠标按键
    // 返回值为数字，0代表左键，1代表滚轮，2代表右键
    E.getButton = function(event) {
        if (document.implementation.hasFeature('MouseEvents', '2.0')) {
            return E.getEvent(event).button;
        } else {
            // 针对IE8及版本之前的规范差异
            // IE8 规范的还挺啰嗦的
            switch (E.getEvent(event).button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    };
    // 获取鼠标滚轮信息
    // 忽略opera version<9.5
    E.getWheelData = function(e) {
        var evt = E.getEvent(e);
        // webkit
        if (evt.wheelDelta) {
            return evt.wheelDelta;
        } else {
            // moz
            return evt.detail;
        }
    };
    // 阻止默认行为
    E.preventDefault = function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        if (window.event.returnValue) {
            window.event.returnValue = false;
        }
    };
    // 取消事件冒泡
    E.stopPropagation = function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        if (window.event.cancelBubble) {
            window.event.cancelBubble = true;
        }
    };
    /*
     *获取事件坐标
     *参考：http://www.cnblogs.com/yaozhiyi/archive/2013/01/12/2855583.html
     *http://www.css88.com/archives/1772
     */
    E.offset = function(elem) {
        var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
            box = {
                top: 0,
                left: 0
            },
            doc = elem && elem.ownerDocument;

        if (!doc) {
            return;
        }
        // 与其他元素计算不同的是，body的offsetLeft,offsetTop计算并没有包括margin
        if ((body = doc.body) === elem) {
            var top = body.offsetTop,
                left = body.offsetLeft;

            if (body.offsetTop !== 1) {
                top += parseFloat(body.style.marginTop) || 0;
                left += parseFloat(body.style.marginLeft) || 0;
            }

            return {
                top: top,
                left: left
            };
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        if (!tools.contains(docElem, elem)) {
            return box;
        }

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if (typeof elem.getBoundingClientRect !== 'undefined') {
            box = elem.getBoundingClientRect();
        }
        win = tools.getWindow(doc);
        clientTop = docElem.clientTop || body.clientTop || 0;
        clientLeft = docElem.clientLeft || body.clientLeft || 0;


        scrollTop = win.pageYOffset || docElem.scrollTop;
        scrollLeft = win.pageXOffset || docElem.scrollLeft;
        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
        };
    };
    // 浏览器窗口位置
    // 即使页面滚动了，鼠标只要相对浏览器窗口位置不变，那么x，y就不变
    E.clientX = function(event) {
        return E.getEvent(event).clientX;
    };
    E.clientY = function(event) {
        return E.getEvent(event).clientY;
    };
    // 需要兼容IE8
    // 这个就是相对于页面的坐标了，如果不满一屏，则数值同clientX,clientY
    // 若是超过一屏，还要加上计算滚动坐标
    E.pageX = function(event) {
        event = E.getEvent(event);
        // lte IE8
        if (event.pageX === undefined) {
            //混杂及标准模式下
            return event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
        }
    };
    E.pageY = function(event) {
        event = E.getEvent(event);
        // lte IE8
        if (event.pageY === undefined) {
            //混杂及标准模式下
            return event.clientY + (document.body.scrollTop || document.documentElement.scrollTop);
        }
    };
    // 相对电脑屏幕
    E.screenX = function(event) {
        return E.getEvent(event).screenX;
    };
    E.screenY = function(event) {
        return E.getEvent(event).screenY;
    };
    E.focusin = function(ele, handler) {
        if (document.addEventListener) {
            return ele.addEventListener('focus', handler, true);
        } else {
            return E.addEvent(ele, 'focusin', handler);
        }
    };
    E.focusout = function(ele, handler) {
        if (document.addEventListener) {
            return ele.addEventListener('blur', handler, true);
        } else {
            return E.addEvent(ele, 'focusout', handler);
        }
    };
    return E;
});
