require(['domReady', 'eventBind'], function(ready, bind) {
    ready(function() {
        var btn = document.getElementById('btn');

        bind.addEvent(btn, 'click', function(e) {
            alert('1');
        });
        bind.addEvent(btn, 'click', function(e) {
            alert('2');
        });
    });
});
