var db     = require('./database/manager');
var config = require('./config/config.js');
var utils = require('./utils');
var AmazingSpiderman =  require('./amazingspiderman')

var spidey = new AmazingSpiderman();

var Jobs = function(selectors) {

	processUrl = function(url, urlId) {
		console.log('Going to process... '+url);
		domainName = utils.common.getDomain(url);
		//console.log(selectors[domainName]);
		if (selectors.domainName !== 'undefined') {
			
			spidey.request(selectors[domainName], url).then(function(data) {
				console.log(data);
				data.url_id = urlId;
				utils.db.setUrlData(data);
				console.log('Processed... '+url);
				
				utils.db.update('urls', {status:1}, {id:urlId}).then(function(o) {
					console.log('Updated DB for ... '+url);
				}).catch(function(e) {
					console.log(e);
				});

			}).catch(function(err){
				//utils.db.setUrlData(data);
				console.log(err);
				// todo - get the error code from config
				var comment = utils.common.escapeString(JSON.stringify(err));

				utils.db.update('urls', {status:99, comment:comment}, {id:urlId}).then(function(obj) {
					console.log('Updated DB for ... '+url);
				}).catch(function(e){
					console.log(e);
				});

				console.log('Processed... '+url);
			});
			
		}
	};

	this.processUrls = function(filter) {
		utils.db.getUrls(filter).then(function(rows) {
			for(i=0; i<rows.length; i++) {
				processUrl(rows[i].url, rows[i].id);
			}	
		});
	}

}

module.exports = Jobs;