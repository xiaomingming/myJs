define(['knife'], function(tools) {
    /*
     * DOM
     */
    // 兼容性的getClassName方法
    // context只能是一个具体的环境对象
    // 不需要htmlCollection
    var D = {};
    D.getClassName = function(cName, context) {
        context = context || document;
        if (document.getElementsByClassName) {
            return context.getElementsByClassName(cName);
        } else {
            // IE8以下的非主流
            var domArr = context.getElementsByTagName('*'),
                i = 0,
                j = domArr.length,
                reg = new RegExp('(^|\\s)' + cName + '(\\s|$)'),
                resultArr = [];

            for (; i < j; i++) {
                if (reg.test(domArr[i].className)) {
                    resultArr.push(domArr[i]);
                }
            }
            return resultArr;
        }
    };

    D.getTagName = function(tagName, context) {
        return context.getElementsByTagName(tagName);
    };
    // 获取当前DOM上下文环境
    // 传入一个选择器，一个父类选择环境
    D.getContext = function(selectorString, context) {

        var _this = this;
        var sArr = selectorString.split('.'), //选择器拆分
            tagName;
        var contextArr = [], //context筛选结果
            make = []; //makeArra结果

        var m, i, j, reg;

        var regObj = {
            'id': function(s) {
                return (/#/.test(s));
            },
            'className': function(s) {
                return (/\./.test(s));
            },
            'tagName': function(s) {
                return (/[^\.#]/.test(s));
            }
        };

        // 初始化dom方法
        var getDom = function(context) {
            if (regObj.className(selectorString)) {
                return _this.getClassName(sArr[1], context);
            } else if (regObj.tagName(selectorString)) {
                return _this.getTagName(sArr[0], context);
            }
        };


        // 获取 context数组
        if (context.length === 0) {
            return [];
        } else if (!context.length) {
            contextArr = tools.makeArray(getDom(context));
        } else {
            for (i = 0, j = context.length; i < j; i++) {
                make = tools.makeArray(getDom(context[i]));
                contextArr = contextArr.concat(make);
            }
        }
        context = contextArr;

        // 规避掉类似p#box.box1的脑残写法
        if (regObj.id(selectorString)) {

            selectorString = selectorString.match(/#[a-zA-z\d]+/)[0].substring(1);
            return document.getElementById(selectorString);

        } else if (regObj.className(selectorString)) {

            if (selectorString.charAt(0) !== '.') {
                // 标签配合类别选择器

                tagName = sArr[0];

                // 第一层为对比的类名
                //获取符合第一个类名的环境

                // 循环该环境对象，获取每个对象的className属性，并做比较
                for (m = 0; m < context.length; m++) {
                    for (i = 1, j = sArr.length; i < j; i++) {
                        reg = new RegExp('(^|\\s)' + sArr[i] + '(\\s|$)');
                        if (context[m].tagName.toLowerCase() !== tagName || !reg.test(context[m].className)) {
                            context.splice(m, 1);
                            m--;
                            break;
                        }
                    }
                }
                return context;
            } else {
                // 纯类别选择器
                // 可能为一个
                // 可能为多个
                if (selectorString.split('.').length === 2) {
                    // 一个类别的情形
                    // 遍历context
                    // 寻找
                    return context;

                } else {
                    // 多个类别
                    for (m = 0; m < context.length; m++) {
                        for (i = 1, j = sArr.length; i < j; i++) {
                            reg = new RegExp('(^|\\s)' + sArr[i] + '(\\s|$)');
                            if (!reg.test(context[m].className)) {
                                context.splice(m, 1);
                                // m--;
                                break;
                            }
                        }
                    }
                    return context;
                }
            }
        }
        return context; //纯标签情形
    };
    // 只支持简单的选择器组合
    // 包括id，类别，标签组合
    // 比如：$('.box.box2 p span'),$('#myMod .box span'),$('div span')
    D.$ = function(selectorString, context) {
        var _this = this;

        var selectorArr = selectorString.split(' '),
            selectorEnd = selectorArr[selectorArr.length - 1];

        context = context || document;

        var i = 0,
            j = selectorArr.length,
            result = context;

        if (/#/.test(selectorEnd)) {
            // id选择器
            // 避免#box.test情况的出现
            return document.getElementById(selectorEnd.match(/^#[a-zA-z0-9-_]+/)[0].substring(1));
        } else {
            if (document.querySelectorAll) {
                return tools.makeArray(document.querySelectorAll(selectorString));
            } else {
                // 复合选择器判断
                // for <IE8
                for (; i < j; i++) {

                    result = _this.getContext(selectorArr[i], tools.makeArray(result));
                }
                return tools.distinctArr(result);
            }
        }
    };
    // set get attribute
    D.attr = function(ele, atr, val) {
        if (arguments.length === 2) {
            return ele.getAttribute(atr);
        } else if (arguments.length === 3) {
            ele.setAttribute(atr, val);
        }
    };
    // 
    D.addClass = function(ele, className) {
        // 若为单独的DOM对象
        // 直接给该对象添加 className
        // 否则，遍历添加
        var reg = new RegExp('(^|\\s)' + className + '(\\s|$)'),
            i = 0,
            j;
        var addOne = function(oneEle) {
            var originClass = oneEle.className;
            if (!reg.test(ele.className)) {
                oneEle.className = originClass + (originClass === '' ? '' : ' ') + className;
            }
        };
        if (!ele.length) {
            addOne(ele);
        } else {
            for (j = ele.length; i < j; i++) {
                addOne(ele[i]);
            }
        }
    };
    // 不设置第二个参数时，默认移除所有类名
    D.removeClass = function(ele, className) {
        // 若为单独的DOM对象
        // 直接给该对象删除 className
        // 否则，遍历删除
        var reg = new RegExp('(^|\\s)' + className + '(\\s|$)'),
            i = 0,
            j,
            argsLen = arguments.length;
        var delOne = function(oneEle) {
            var originClass = oneEle.className;
            oneEle.className = (argsLen === 1) ? '' : originClass.replace(reg, function() {
                return '';
            });
        };
        if (!ele.length) {
            delOne(ele);
        } else {

            for (j = ele.length; i < j; i++) {
                delOne(ele[i]);
            }

        }
    };
    D.toggleClass = function(ele, className) {
        var i = 0,
            j;
        var toggleOne = function(oneEle) {
            D.hasClass(oneEle, className) ? D.removeClass(oneEle, className) : D.addClass(oneEle, className);
        };
        if (!ele.length) {
            toggleOne(ele);
        } else {
            for (j = ele.length; i < j; i++) {
                toggleOne(ele[i]);
            }
        }
    };
    D.getFirstChild = function(parentNode) {
        var firstChild = parentNode.firstChild;
        while (firstChild !== null && firstChild.nodeType !== 1) {
            firstChild = firstChild.nextSibling;
        }
        return firstChild;
    };
    // 获取最后一个子元素
    D.getLastChild = function(parentNode) {
        var lastChild = parentNode.lastChild;
        while (lastChild !== null && lastChild.nodeType !== 1) {
            lastChild = lastChild.previousSibling;
        }
        return lastChild;
    };
    // 获取子节点标签
    // 其实，ele.childreen就可以了
    D.getChilds = function(parentNode) {
        var childNodes = parentNode.childNodes,
            childArr = [];
        for (var i = 0, j = childNodes.length; i < j; i++) {
            if (childNodes[i].nodeType === 1) {
                childArr.push(childNodes[i]);
            }
        }
        return childArr;
    };

    // 获取下一个兄弟节点
    D.getNext = function(node) {
        var next = node.nextSibling;
        while (next !== null && next.nodeType !== 1) {
            next = next.nextSibling;
        }
        return next;
    };

    // 获取所有兄弟节点
    D.getNextAll = function(node) {
        var next = this.getNext(node),
            nextArr = [];
        nextArr.push(next);
        while (this.getNext(next) !== null) {
            next = this.getNext(next);
            nextArr.push(next);
        }
        return nextArr;
    };

    // 获取前一个兄弟节点
    D.getPrev = function(node) {
        var prev = node.previousSibling;
        while (prev !== null && prev.nodeType !== 1) {
            prev = prev.previousSibling;
        }
        return prev;
    };

    // 获取所有兄弟节点
    D.getPrevAll = function(node) {
        var prev = this.getPrev(node),
            prevArr = [];
        prevArr.push(prev);
        while (this.getPrev(prev) !== null) {
            prev = this.getPrev(prev);
            prevArr.push(prev);
        }
        return prevArr;
    };
    // 创建一个插入某个元素之后
    // 判断当前元素后面是否存在元素
    // 若不存在，使用appendChild方法
    // 否则，对其后的元素调用insertBefore方法模拟
    D.insertAfter = function(parentNode, newNode, currentNode) {
        // currentNode不存在时
        if (arguments.length === 2) {
            return parentNode.appendChild(newNode);
        }
        var next = this.getNext(currentNode);

        if (next !== null) {
            return parentNode.insertBefore(newNode, next);
        }
        // 下一个元素不存在时
        return parentNode.appendChild(newNode);
    };

    // 获取某个下标的元素
    // 传入选择器，或者DOM对象
    // 第二个为下标
    D.eq = function(ele, index) {
        if (typeof ele === 'string') {
            ele = this.$(ele);
        }
        return ele[index];
    };
    // 获取元素的下标
    // 第二个参数为可选参数
    // 忽略第二个参数时，下标为该元素的在兄弟元素中的位置
    // 否则，为第二个参数提供的参考列表中的位置
    D.getIndex = function(ele, context) {
        var ct = context || [],
            i = 0,
            j = ct.length;
        if (typeof ele === 'string') {
            ele = this.$(ele);
        }
        // 
        if (arguments.length === 1) {
            return this.getPrevAll(ele).length;
        }
        for (; i < j; i++) {
            if (ele === ct[i]) {
                break;
            }
        }
        return i;
    };
    // 某个DOM对象是否有指定className
    // 类名只能指定一个，或者多个，但是，多个必须使用'|'分隔
    // class1|class2|class3
    D.hasClass = function(ele, cName) {
        // 单独的类别
        if (!/\|/.test(cName)) {
            return new RegExp('(^|\\s)' + cName + '(\\s|$)').test(ele.className);
        }
        // 多个类别
        var classArr = cName.split('|'),
            targetClass = ele.className;

        for (var i = 0, j = classArr.length; i < j; i++) {
            var reg = new RegExp('(^|\\s)' + classArr[i] + '(\\s|$)');
            if (!reg.test(targetClass)) {
                return false;
            }
        }
        return true;
    };
    // 文本操作
    // 不支持DOM数组
    // 只支持单个DOM对象的html插入
    D.html = function(ele, str) {
        if (arguments.length === 1) {
            return ele.innerHTML;
        }
        ele.innerHTML = str;
    };
    // 文本获取和设置
    D.text = function(ele, str) {
        if (arguments.length === 1) {
            return ele.innerText;
        }
        var txt = document.createTextNode(str);
        this.html(ele, '');
        ele.appendChild(txt);
    };
    // style获取，设置
    // 盒模型宽高此方法无法获取
    D.css = function(ele, sty) {
        var prop;
        var setOneStyle = function(ele) {
            for (var key in sty) {
                if (sty.hasOwnProperty(key)) {
                    prop = key.replace(/(-[a-z])/gi, function(m, group, i, t) {
                        return group.charAt(1).toUpperCase();
                    });
                    ele.style[prop] = sty[key];
                }
            }
        };
        // get style 只可以针对单个DOM对象
        var getStyle = function(ele) {
            if (tools.isType(sty, 'string')) {

                prop = sty.replace(/(-[a-z])/gi, function(m, group, i, t) {
                    return group.charAt(1).toUpperCase();
                });
                return ele.style[prop];
            }
            return '';
        };

        if (tools.isType(sty, 'object')) {
            if (tools.isDomArr(ele)) {
                for (var i = 0, j = ele.length; i < j; i++) {
                    setOneStyle(ele[i]);
                }
            } else {
                setOneStyle(ele);
            }

        } else {
            if (tools.isDomArr(ele)) {
                ele = ele[0];
            }
            return getStyle(ele);
        }
    };
    // 控制样式显示与隐藏
    D.show = function(ele) {
        var i = 0,
            j,
            showOne = function(ele) {
                ele.style.display = 'block';
            };
        if (tools.isDomArr(ele)) {
            for (j = ele.length; i < j; i++) {
                showOne(ele[i]);
            }
        } else {
            showOne(ele);
        }

    };
    D.hide = function(ele) {
        var i = 0,
            j,
            hideOne = function(ele) {
                ele.style.display = 'none';
            };
        if (tools.isDomArr(ele)) {
            for (j = ele.length; i < j; i++) {
                hideOne(ele[i]);
            }
        } else {
            hideOne(ele);
        }

    };
    return D;
});
