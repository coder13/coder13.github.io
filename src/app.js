var css = require('./styles/main.css');
var React = require('react');
var App = {
	Models: {
		Timer: require('./models/timer.js'),
		Session: require('./models/session.js')
	}
};

var Timer = require('./views/timer.js');
var Session = require('./views/session.js');

var session = new App.Models.Session();
var timer = new App.Models.Timer({
	update: 'seconds',
	accuracy: 2,
	input: 'timer',
	inspection: 15,
	phase: 1,
	addTime: session.addTime.bind(session)
});

var Page = React.createClass({

	render: function () {
		return (
			<div class="page">
				<div id="session" className="container">
					<Session collection={session}/>
				</div>
				<div id="timer" class="container">
					<Timer model={timer}/>
				</div>
			</div>
		);
	}
});

React.render(<Page/>, document.body);
