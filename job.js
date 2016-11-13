var Jobs = require('./jobs');
var utils = require('./utils');

var job    = process.argv[2] || 'processUrls'; 
var job    = job.trim();
var params = {status:process.argv[3] || 0}; 

if (job == 'processUrls') {
	utils.db.getSelectors().then(function(rows){ /* process only when selectors are there */
		var j = new Jobs(rows);
		var singleSelector = process.argv[4]; 
		j[job](params, singleSelector);
	}).catch(function(err) {
		console.log(err);
	});
} else if(job == 'transformUrls') {
	var params = {status:process.argv[3] || 1}; 
	j[job](process.argv[3]);	
} else if(job == 'processScreenShots') {
	var j = new Jobs({});
	var params = {status:process.argv[3] || 2}; 
	j[job](params);	
} else {
	var j = new Jobs({});
	j[job](process.argv[3], process.argv[4]);
	
}


