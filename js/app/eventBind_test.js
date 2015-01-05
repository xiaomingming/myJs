require(['domReady', 'evt'], function(ready, E) {
    ready(function() {
        var btn = document.getElementById('btn');

        E.addEvent(btn, 'click', function(e) {
            alert('1');
        });
        E.addEvent(btn, 'click', function(e) {
            alert('2');
        });
    });
});
