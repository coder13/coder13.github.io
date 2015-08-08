var React = require('react');
var utils = require('../utils');

var Session = module.exports = React.createClass({
    componentDidMount: function() {
        this.props.collection.on('add', function (e) {
            this.forceUpdate();
        }.bind(this));
    },

    render: function () {
        var times = this.props.collection.length;
        var mean = this.props.collection.mean();
        var timeList = this.props.collection.map(function (key, index) {
            console.log(key, index);
            return (<tr><td>{index}</td><td>{utils.pretty(key.attributes.time)}</td></tr>);
        });

        var name = '3x3';
        return (<table>
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
                            <th colSpan="2">Mean of {times} = {utils.pretty(mean)}</th>
                        </tr>
                    </tfoot>
                </table>);
    }
});
