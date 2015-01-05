define([], function() {
    var addEvent = function(ele, etype, callback) {
        ele.addEventListener(etype, function(e) {
            callback(e);
        }, false);
    };
    var removeEvent = function(ele, etype, callback) {
        ele.removeEventListener(etype, function() {
            callback();
        });
    };
    return {
        addEvent: addEvent,
        removeEvent: removeEvent
    };
});
