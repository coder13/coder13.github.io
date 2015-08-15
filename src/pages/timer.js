var $ = require('jquery');
var React = require('react');
var TimerModel = require('../models/timer.js');
var SessionModel = require('../models/session.js');
var Scrambo = require('scrambo');

var Timer = require('../views/timer.js');
var Session = require('../views/session.js');

var scrambelor = new Scrambo();
var scramble = scrambelor.get();

var session = new SessionModel();
var timer = new TimerModel({
	update: 'seconds',
	accuracy: 2,
	input: 'timer',
	inspection: 15,
	phase: 1,
	addTime: function (time) {
		session.addTime(time);
		scramble = scrambelor.get();
		console.log(scramble);
		$('#scramble').html(scramble);
	}
});

module.exports = React.createClass({
	render: function () {
		return (
			<div class="page">
				<div id="scrambleContainer"><span id="scramble"></span></div>
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
