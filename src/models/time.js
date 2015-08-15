var Backbone = require('backbone');

var Time = module.exports = Backbone.Model.extend( {
	defaults: {
		time: 0,
		plus2: false,
		DNF: false
	}
});
