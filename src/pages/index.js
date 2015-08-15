var React = require('react');

var Page = module.exports = React.createClass({
    render: function () {
        return (
            <div class="page">
                <p>test</p>
                <a href='/timer' className='button button-large'>
                    Timer!
                </a>
            </div>
        );
    }
});
