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
}

// Time

App.Models.Time = Backbone.Model.extend( {
	defaults: {
		time: 0,
		plus2: false,
		DNF: false
	}
});

var Time = React.createClass({
	render: function () {
		return (<span>{pretty(this.props.model.time)}</span>);
	}
});

// Session

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
	},

	addTime: function (time) {
		this.add({time: time});
	}

});

var Session = React.createClass({
	componentDidMount: function() {
		this.props.collection.on('add', function (e) {
			this.forceUpdate();
		}.bind(this));
	},

	render: function () {
		var times = this.props.collection.length, mean = this.props.collection.mean();
		var timeList = this.props.collection.map(function (key, index) {
			console.log(key, index);
			return (<tr><td>{index}</td><td>{pretty(key.attributes.time)}</td></tr>);
		});

		var name = '3x3';
		return (
				<table>
				<caption>Session: {name}</caption>
					<thead>
				  		<tr>
							<th></th>
							<th>Time</th>
						</tr>
					</thead>
					<tbody id="times">{timeList}</tbody>
					<tfoot>
						<tr>
							<th colSpan="2">Mean of {times} = {pretty(mean)}</th>
						</tr>
					</tfoot>
				</table>);
	}
});


var session = new App.Collections.Session();
React.render(<Session collection={session}/>, document.getElementById("session"));

// Timer

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

var Timer = React.createClass({
	style: {fontSize: '48px', margin: '2px'},
	
	getInitialState: function() {
		return {timing: false, down: false};
	},

	componentDidMount: function() {
		$(document).bind('keyup', _.bind(this.keyUp, this));
		$(document).bind('keydown', _.bind(this.keyDown, this));
		this.props.model.on('change', function () {
			this.forceUpdate();
		}.bind(this));
	},
	
	keyDown: function(e) {
		if (e.keyCode == 32) {
			if (this.timing) {
				this.props.model.stop();
			} else
				this.setState({down: true});
		}
		this.render();
	},

	keyUp: function (e) {
		if (e.keyCode == 32) {
			if (!this.timing) {
				this.props.model.start();
				this.timing = true;
				this.setState({down: false});
			} else {
				this.timing = false;
			}
		}
		this.render();
	},

	render: function() {
		var style = {color: this.state.down?'green':'black'};
		return (<p style={_.extend(style, this.style)}>{pretty(this.props.model.time)}</p>);
	}
});

var timer = new App.Models.Timer({accuracy: 2, input: 'timer', inspection: 15, phase: 1, addTime: _.bind(session.addTime, session)});
React.render(<Timer model={timer}/>, document.getElementById('timer'));

// var Header = React.createClass({
// 	childContextTypes: {
// 		muiTheme: React.PropTypes.object
// 	},

// 	getChildContext: function() {
// 		return {
// 			muiTheme: ThemeManager.getCurrentTheme()
// 		};
// 	},

// 	componentWillMount: function() {
// 		ThemeManager.setPalette({
// 			accent1Color: Colors.deepOrange500
// 		});
// 	},

// 	render: function() {
// 		return (<div></div>);
// 	}

// });