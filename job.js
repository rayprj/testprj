var Jobs = require('./jobs');
var utils = require('./utils');

var job    = 'processUrls'; /* @todo get from CLI */
var params = {status:0}; /* @todo get from CLU */

utils.db.getSelectors().then(function(rows){ /* process only when selectors are there */
	console.log('selectors available...');
	console.log(rows);
	var j = new Jobs(rows);
	j[job](params);

}).catch(function(err) {
	console.log(err);
});
