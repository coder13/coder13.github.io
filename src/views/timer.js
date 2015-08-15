var _ = require('lodash');
var $ = require('jquery');
var React = require('react');
var utils = require('../utils.js');

module.exports = React.createClass({
    style: {fontSize: '160px', margin: '2px'},

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
        if (e.keyCode === 32) {
            if (this.timing) {
                this.props.model.stop();
            } else {
                this.setState({down: true});
            }
        }
        this.render();
    },

    keyUp: function (e) {
        if (e.keyCode === 32) {
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
        var style = {color: this.state.down ? 'green' : 'black'};
        return (<p style={_.extend(style, this.style)}>{utils.pretty(this.props.model.time)}</p>);
    }
});
