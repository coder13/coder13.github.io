var React = require('react');

module.exports = React.createClass({
	render: function () {
		return (<span>{pretty(this.props.model.time)}</span>);
	}
});
