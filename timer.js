/*
	Space: 32
	Escape: 27

	Convienence functions:
*/

function now () {
	return (window.performance && window.performance.now
			? window.performance.now.bind(window.performance)
			: Date.now)().toFixed();
}

function pretty (time) {
	if (time < 0)
		return 'DNF';

	time = Math.round(time / 10);
	var bits = time % 100;
	time = (time - bits) / 100;
	var secs = time % 60;
	var mins = ((time - secs) / 60) % 60;

	var out = [bits];
	if (bits < 10) {
		out.push('0');
	}
	out.push('.');
	out.push(secs);
	if (secs < 10 && mins > 0) {
		out.push('0');
	}
	if (mins > 0) {
		out.push(':');
		out.push(mins)
	}
	return out.reverse().join('');
}

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


function setInterval(fn, delay) {
	// Have to use an object here to store a reference
	// to the requestAnimationFrame ID.
	var handle = {};

	function interval() {
		fn.call();
		handle.value = requestAnimationFrame(interval)
	}

 	handle.value = requestAnimationFrame(interval);
	return handle;
}

function clearInterval(interval) {
	cancelAnimationFrame(interval.value);
}

/*
	App
*/

window.App = {
	Models: {},
	Collections: {},
	Views: {},
}

App.Models.Time = Backbone.Model.extend( {
	defaults: {
		time: 0,
		plus2: false,
		DNF: false
	}
});

App.Views.Time = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#timeTemplate').html()),

	events: {'click .Delete': 'delete'},
	initialize: function (options) {
		this.session = options.session;
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	delete: function (e) {
		this.model.collection.remove(this.model);
		this.remove();
		this.unbind();
	}
});

App.Collections.Session = Backbone.Collection.extend({
	model: App.Models.Time,

	average: function () {
		return 0;
	}
});

App.Views.Session = Backbone.View.extend({
	tagName: 'ul',

	template: _.template($("#sessionTemplate").html()),

	initialize: function () {
		this.$el.append(this.render().el);
		
		this.collection.each(function(time) {
			var timeView = new App.Views.Time({model: time, session: this.collection});
			$("#times").append(timeView.render().el);
		}, this);
	},

	render: function () {
		this.$el.html(this.template({average: this.collection.average()}));

		return this;
	},

	add: function (time) {
		var timeModel = new App.Models.Time(time);
		this.collection.push(timeModel);
		var timeView = new App.Views.Time({model: timeModel, session: this.collection});
		$("#times").append(timeView.render().el);
	}
});

var session = new App.Collections.Session();
var sessionView = new App.Views.Session({el: $("#timeContainer"), collection: session});

App.Models.Timer = Backbone.Model.extend({
	defaults: {
		accuracy: 2, 		// # of digits displayed after the decimal point
		input: 'timer',		// timer, manual, stackmat
		inspection: 15,		// Amount of inspection in seconds. 15s is WCA
		phase: 1
	},
	active: false,
	time: 0,

	initialize: function (options) {
		if (options.addTime)
			this.addTime = options.addTime;
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
			if (this.addTime)
				this.addTime(this.time);
			this.time = 0;
		}
	},

	tick: function () {
		this.time = (now() - this.started);
		this.trigger('change', this);
	}
});

App.Views.Timer = Backbone.View.extend({
	template: _.template($('#timerTemplate').html()),

	initialize: function () {
		$(document).bind('keyup', _.bind(this.keyUp, this));
		$(document).bind('keydown', _.bind(this.keyDown, this));

		this.model.bind('change', _.bind(this.render, this));
		this.$el.append(this.render().el);
	},
	keyDown: function (e) {
		if (e.keyCode == 32) {
			if (this.timing) {
				this.model.stop();
			}
		}
	},
	keyUp: function (e) {
		if (e.keyCode == 32) {
			if (!this.timing) {
				this.model.start();
				this.timing = true;
			} else {
				this.timing = false;
			}
		}
	},

	render: function () {
		this.$el.html(this.template({time: this.model.time}));
		return this;
	}
});

function AddTime(time) {
	sessionView.add({time: time});
}

var timer = new App.Models.Timer({accuracy: 2, input: 'timer', inspection: 15, phase: 1, addTime: AddTime});
var timerView = new App.Views.Timer({el: $("#timer"), model: timer});