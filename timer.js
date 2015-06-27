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
	tagName: 'span',
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
	defaults: {
		name: "default"
	},
	model: App.Models.Time,

	mean: function () {
		var total = 0;
		this.toArray().forEach(function (i) {
			total += i.attributes.time;
		});
		return total != 0 ? total / this.length : 0;
	}
});

App.Views.Session = Backbone.View.extend({
	tagName: 'table',

	template: _.template($("#sessionTemplate").html()),
	rowTemplate: _.template($("#sessionRowTemplate").html()),

	initialize: function () {
		this.collection.bind('change', _.bind(this.render, this));

		this.$el.append(this.render().el);
		
	},

	render: function () {
		this.$el.html(this.template({mean: this.collection.mean()}, this.collection.toJSON()));
		this.collection.each(function(time, index) {
			this._addModel(time, index);
		}, this);

		return this;
	},

	add: function (time) {
		var timeModel = new App.Models.Time(time);
		this.collection.push(timeModel);
		// this._addModel(timeModel, this.collection.length-1);

		this.collection.trigger('change');
	},

	_addModel: function (timeModel, index) {
		var timeView = new App.Views.Time({model: timeModel, session: this.collection});
		var time = timeView.template(timeView.model.toJSON())
		var row = this.rowTemplate({index: index, time: time});
		$("#times").append(row);
	}
});

var session = new App.Collections.Session([]);
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


// var Timer = React.createClass({
// 	style: {fontSize: '48px', margin: '2px'},
// 	getInitialState: function() {
// 		return {time: 0, timing: false, down: false};
// 	},
	
// 	componentDidMount: function() {
// 		$(document).bind('keyup', _.bind(this.keyUp, this));
// 		$(document).bind('keydown', _.bind(this.keyDown, this));
// 	},

// 	render: function() {
// 		var style = {color: this.state.down?'green':'black'};
// 		return (<p style={_.extend(style, this.style)}>{pretty(this.state.time)}</p>);
// 	}
// });

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
		// React.render(<Timer/>, this.el);
		return this;
	}
});

function AddTime(time) {
	sessionView.add({time: time});
}

var timer = new App.Models.Timer({accuracy: 2, input: 'timer', inspection: 15, phase: 1, addTime: AddTime});
var timerView = new App.Views.Timer({el: $("#timer"), model: timer});