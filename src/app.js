require('./styles/main.css');
var Router = require('./router');
var App = require('ampersand-app');
var Me = require('./models/me');

var app = window.app = App.extend({
    init: function () {
        this.me = new Me();
        this.router = new Router();
        this.router.history.start();
    }
});

app.init();
app.router.navigate('timer');
