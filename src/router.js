var Router = require('ampersand-router');
var React = require('react');
var IndexPage = require('./pages/index.js');
var TimerPage = require('./pages/timer.js');
var SettingsPage = require('./pages/settings.js');

module.exports = Router.extend({
    routes: {
        '': 'home',
        'timer': 'timer',
        'settings': 'settings'
    },

    home () {

    },

    index () {
        React.render(<IndexPage/>, document.body);
        console.log('index');
    },

    timer () {
        React.render(<TimerPage/>, document.body);
        console.log('timer');
    },

    settings () {
        React.render(<SettingsPage/>, document.body);
        console.log('settings');
    }
});
