require(['domReady', 'dom', 'evt', 'ajax'], function(ready, D, E, ajax) {
    ready(function() {
        E.addEvent(D.$('button')[0], 'click', function() {
            var data = {
                name: '小伙子',
                age: 24
            };
            ajax.post('', data, function() {
                alert('lalalal');
            }, true);
            ajax.get('', data, function() {
                alert('lalalal');
            }, true);
        });
    });
});
