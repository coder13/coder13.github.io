var Router = require('ampersand-router');
var React = require('react');
var IndexPage = require('./pages/index.js');
var TimerPage = require('./pages/timer.js');
var SettingsPage = require('./pages/settings.js');

module.exports = Router.extend({
    routes: {
        '': 'timer',
        'timer': 'timer',
        'settings': 'settings'
    },

    index: function () {
        React.render(<IndexPage/>, document.body);
        console.log('index');
    },

    timer: function () {
        React.render(<TimerPage/>, document.body);
        console.log('timer');
    },

    settings: function () {
        React.render(<SettingsPage/>, document.body);
        console.log('settings');
    }
});
