var db     = require('./database/manager');
var config = require('./config/config.js');
var utils = require('./utils');
var AmazingSpiderman =  require('./amazingspiderman')

var spidey = new AmazingSpiderman();

var Jobs = function(selectors) {

	this.selectors = selectors;

	this.processUrl = function(url, urlId, runSelector) {
		console.log('Going to process... '+url);
		domainName = utils.common.getDomain(url);
		selectors = this.selectors;
		//console.log(this.selectors);
		if (selectors[domainName] !== 'undefined') {
			
			var onlySelectors = {};
			

			if (typeof runSelector != 'undefined') {
				onlySelectors[runSelector] = selectors[domainName][runSelector] && selectors[domainName][runSelector]['selector'];
				console.log('Processing only...');
				console.log(onlySelectors);
			} else {
				for(s in selectors[domainName]) {
					onlySelectors[s] = selectors[domainName][s]['selector'];
				}
			}

			

			//onlySelectors.c = 'tr:contains("Item model number") td.a-size-base'
			spidey.request(onlySelectors, url).then(function(data) {
				
				console.log(data);

				for(sel in selectors[domainName]) {

					if (typeof runSelector != 'undefined' && sel!=runSelector) {
						continue; /* to just process only the selected selector */
					}

				    utils.db.setUrlDataDenormal(urlId, data, sel, selectors[domainName]).then(function(r){
				    	utils.db.update('urls', {status:1}, {id:urlId}).then(function(o) {
							console.log('Updated DB for ... '+url);
						}).catch(function(e) {
							console.log(e);
						});
				    }).catch(function(e){
				        console.log(e);
				    });
				}

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

	this.processUrls = function(filter, runSelector) {
		var self = this;
		utils.db.getUrls(filter).then(function(rows) {
			console.log('Records going to process... '+ rows.length);
			for(i=0; i<10; i++) {
				self.processUrl(rows[i].url, rows[i].id, runSelector);
			}	
		});
	};

	this.transformUrls = function(filter) {
		var self = this;
		utils.db.getUrlData(filter).then(function(rows) {
			console.log('Records going to process... '+ rows.length);
			for (i=0; i<10; i++) {
				//self.processUrl(rows[i].url, rows[i].id);
			}	
		});
	};

	this.importSelectors = function(domainId, fileName) {
		console.log('importSelectors...');
		
		fs = require('fs');

		fs.readFile('./'+fileName, 'utf8', function (err, data) {
		  if (err) {
		    return console.log(err);
		  }
		  
		  utils.db.query('SELECT id, name FROM selectors').then(function(rows) {
		  	
		  	for(i=0; i<rows.length; i++) {
            	selectors[rows[i].name] = rows[i].id;
            }
            obj = JSON.parse(data);
		  	for (e in obj.selectors) {
		  		if (typeof selectors[obj.selectors[e].id] !== 'undefined') {
		  			utils.db.setDomainSelectors(domainId, selectors[obj.selectors[e].id], obj.selectors[e].selector).then(function(r){
		  				console.log('Updated ...'+domainId+','+selectors[obj.selectors[e].id]+','+obj.selectors[e].selector);
		  			}).then(function(e){
		  				console.log(e);
		  			});
		  		}
			}

		  }).catch(function(e) {
		  	return console.log(e);
		  });
		  //console.log(data);
		});
	};
}

module.exports = Jobs;