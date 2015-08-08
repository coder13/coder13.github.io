var Backbone = require('backbone');

var requestAnimationFrame =
    window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(fn) { return window.setTimeout(fn, 1000 / 60); };

var cancelAnimationFrame =
    window.cancelAnimationFrame || window.webkitCancelAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame || window.clearTimeout;

var setInterval = function (fn, delay) {
    // Have to use an object here to store a reference
    // to the requestAnimationFrame ID.
    var handle = {};

    function interval() {
        fn.call();
        handle.value = requestAnimationFrame(interval);
    }

    handle.value = requestAnimationFrame(interval);
    return handle;
};

var clearInterval = function (interval) {
    cancelAnimationFrame(interval.value);
};

var now = function () {
    return (window.performance && window.performance.now
        ? window.performance.now.bind(window.performance)
        : Date.now)().toFixed();
};

module.exports = Backbone.Model.extend({
    defaults: {
        accuracy: 2,        // # of digits displayed after the decimal point
        input: 'timer',     // timer, manual, stackmat
        inspection: 15,     // Amount of inspection in seconds. 15s is WCA
        phase: 1
    },
    active: false,
    time: 0,

    initialize: function (options) {
        if (options.addTime) {
            this.addTime = options.addTime;
        }
    },

    start: function () {
        if (!this.active) {
            this.active = true;
            this.started = now();
            this.timerObj = setInterval(_.bind(this.tick, this), 10);
        }
    },

    stop: function() {
        if (this.active) {
            this.active = false;
            clearInterval(this.timerObj);
            if (this.addTime) {
                this.addTime(this.time);
            }
            this.time = 0;
        }
    },

    tick: function () {
        this.time = (now() - this.started);
        this.trigger('change', this);
    }
});
