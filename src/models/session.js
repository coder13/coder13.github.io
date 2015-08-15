var Backbone = require('backbone');
var Time = require('./time.js');

var Session = module.exports = Backbone.Collection.extend({
    defaults: {
        name: 'default'
    },
    model: Time,

    mean: function () {
        var total = 0;
        this.toArray().forEach(function (i) {
            total += i.attributes.time;
        });
        return total !== 0 ? total / this.length : 0;
    },

    addTime: function (time) {
        this.add({time: time});
    }
});
