var db     = require('./database/manager');
var config = require('./config/config.js');
var utils = require('./utils');
var AmazingSpiderman =  require('./amazingspiderman')
var async = require('async');

var spidey = new AmazingSpiderman();

var Q = require('q');

var Jobs = function(selectors) {

	this.selectors = selectors;

	this.urlProessingLimit = 2;


	this.processUrl = function(param) {

		var url = param.url;
		var urlId = param.urlId;
		var runSelector = param.runSelector;

		//var url = 'http://localhost:8080/';

		console.log('Going to process... '+url+' (# '+urlId+')');

		domainName = utils.common.getDomain(url);
		var selectors = this.selectors;

		var self=this;

		var deferred = Q.defer();
		if (typeof selectors[domainName] !== 'undefined') {

			var selectors = selectors[domainName];
			var onlySelectors = {};

			if (typeof runSelector != 'undefined') {
				onlySelectors[runSelector] = selectors[runSelector] && selectors[runSelector]['selector'];
			} else {
				for (s in selectors) {
					onlySelectors[s] = selectors[s]['selector'];
				}
			}
			spidey.request(onlySelectors, url).then(function(data) {
				console.log('Got data for '+url+' (# '+urlId+')');
				
				var promises = [];
				for(sel in selectors) {
					if (typeof runSelector != 'undefined' && sel!=runSelector) {
						continue; /* to just process only the selected selector */
					}
					//console.log('Processing....'+sel);
				    promises.push(utils.db.setUrlDataDenormal(urlId, data, sel, selectors));
				}

				Q.allSettled(promises).then(function(res) {
					utils.db.update('urls', {status:2}, {id:urlId}).then(function(r){
						console.log('Processed data for '+url+' (# '+urlId+')');
						deferred.resolve(urlId);
					}).catch(function(e){
						deferred.reject(e);
					});
				});


			}).catch(function(err){
				
				console.log(err);

				var comment = utils.common.escapeString(JSON.stringify(err));
				utils.db.update('urls', {status:99, comment:comment}, {id:urlId}).then(function(o) {
					deferred.resolve(urlId);
				}).catch(function(e) {
					deferred.reject(e);
				});
			});
			
		} else {
			utils.db.update('urls', {status:88, comment:'no selectors'}, {id:urlId}).then(function(o) {
				deferred.resolve(urlId);
			}).catch(function(e) {
				deferred.reject(e);
			});

		}

		return deferred.promise;
	};

	

	this.updateUrlData = function(urlId, data, selectors, runSelector) {
		if (arguments.length <= 0) {
			return;
		}

		//console.log(data);
		
	};

	
        this.processScreenShot = function(param) {
		
		var deferred = Q.defer();

		var url   = param.url;
		var urlId = param.urlId;
		var imageName = param.urlId;

		var arguments = ['--ssl-protocol=any', './screenshot.js', url, imageName];
		var command   = './phantomjs/bin/phantomjs';

		var cmd = spawn(command, arguments);

		cmd.stdout.on('data', (data) => {
			console.log(`screenshot.js: ${data}`);
		});

		cmd.stderr.on('data', (data) => {
			console.log(`screenshot.js: ${data}`);
		});

		cmd.on('close', (code) => {
			console.log(`screenshot.js exited with code ${code}`);
			//process.exit();

			utils.db.update('urls', {status:3}, {id:urlId}).then(function(r){
				console.log('screenshot done for '+url+' (# '+urlId+')');
				deferred.resolve(urlId);
			}).catch(function(e) {
				deferred.reject(e);
			});

			//deferred.resolve(imageName);
		});

		return deferred.promise;

	};
	this.processScreenShots = function(filter) {

		var self = this;

		utils.db.getUrls(filter, self.urlProessingLimit).then(function(rows) {
			
			if (rows.length <=0) {
				console.log('Processed completely');
				process.exit()
			} else {
				console.log('------------------------------------------------------------------------------');
				console.log('Filling Records to take screenshot... ');
			}

			
			var promises=[];
			for(i=0; i<rows.length; i++) {
				var param = {
					url:rows[i].url,
					urlId: rows[i].id
				}
				
				//console.log(self.selectors);

				promises.push(self.processScreenShot(param));
			}

			Q.allSettled(promises).then(function (results) {
				setTimeout(function() {
					self.processScreenShots(filter)
				}, 100);
			});


		}).catch(function(e) {
			process.exit();
		});

		
	};

	this.processUrls = function(filter, runSelector) {
		var self = this;

		utils.db.getUrls(filter, self.urlProessingLimit).then(function(rows) {
			
			if (rows.length <=0) {
				console.log('Processed completely');
				process.exit()
			} else {
				console.log('------------------------------------------------------------------------------');
				console.log('Filling Records to process... ');
			}

			
			var promises=[];
			for(i=0; i<rows.length; i++) {
				var param = {
					url:rows[i].url,
					urlId: rows[i].id,
					runSelector:runSelector,
				}
				
				//console.log(self.selectors);

				promises.push(self.processUrl(param));
				//q.push(param, self.updateUrlData);
			}

			Q.allSettled(promises).then(function (results) {
				setTimeout(function() {
					self.processUrls(filter, runSelector)
				}, 100);
			});


		}).catch(function(e) {
			process.exit();
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

	this.importUrls = function(fileName) {
		console.log('Import urls from '+fileName);
		utils.db.query('SELECT * FROM domains WHERE deleted=0 ORDER BY id ASC').then(function(rows) {
		  	var domains = [];
		  	var newDomainId = 1;
            //console.log(rows.length);
            if (rows.length>0) {

            	for(i=0; i<rows.length; i++) {
            		domains[rows[i].domain] = rows[i].id;
            	}
            	var newDomainId = rows[rows.length-1].id+1;
            }
            	//console.log(domains);

        	var csv = require('csv-parser');
			var fs = require('fs');

        	var promises=[];

			fs.createReadStream(fileName)
			.pipe(csv())
			.on('data', function (data) {
				//console.log(data);

				if (typeof data.PRODUCT_URL != 'undefined') {
					var domainName = utils.common.getDomain(data.PRODUCT_URL);
					if (typeof domains[domainName] != 'undefined') {
						promises.push(utils.db.setUrl(domains[domainName], data.PRODUCT_URL));
					} else {
			            domains[domainName] = newDomainId++;
			            promises.push(utils.db.setUrl(domains[domainName], data.PRODUCT_URL));
			            promises.push(utils.db.setDomain(domainName, domains[domainName]));
					}
				}

			})
			.on('error', function(e){
				console.log('error '+e);
				process.exit();
			})
			.on('end', function(e){
				
				Q.allSettled(promises).then(function(res) {
					console.log('Processed all the urls');



					process.exit();
				}).catch(function(e){
					console.log(e);
					process.exit();
				});

			});

				
				
		}).catch(function(e){
			console.log(e);
			process.exit();
		}); 
	};

	this.importSelectors = function(fileName) {
		console.log('importSelectors...');
		
		fs = require('fs');

		var self=this;

		fs.readFile(fileName, 'utf8', function (err, data) {
		  if (err) {
		    return console.log(err);
		  }
		  
		  utils.db.query('SELECT id, name FROM selectors').then(function(rows) {
		  	
		  	for(i=0; i<rows.length; i++) {
            	selectors[rows[i].name] = rows[i].id;
            }
            obj = JSON.parse(data);

            if (!utils._.isEmpty(obj.startUrl)) {
            	if (utils._.isArray(obj.startUrl)) {
            		var domainName = utils.common.getDomain(obj.startUrl[0]);
            	} else {
            		var domainName = utils.common.getDomain(obj.startUrl);
            	}
            }


            utils.db.query("SELECT id FROM domains WHERE deleted=0 AND domain='"+domainName+"'").then(function(rows) {
		  		
            	if (rows.length>0) {
            		var domainId = rows[0].id;
            		self.importSelectorsHelper(domainId, obj, selectors);

            	} else {

            		utils.db.query("INSERT INTO domains SET domain='"+domainName+"'").then(function(res){
            			var domainId = res.insertId;
            			self.importSelectorsHelper(domainId, obj, selectors);

            		}).catch(function(e){
            			return console.log(e);
		  				process.exit();
            		})
            		

            	}

		  	}).catch(function(e) {
		  		return console.log(e);
		  		process.exit();
		  	});

		  }).catch(function(e) {
		  	return console.log(e);
		  	process.exit();
		  });
		  //console.log(data);
		});
	};

	this.importSelectorsHelper = function(domainId, obj, selectors) {
		var promises = []
		for (e in obj.selectors) {
	  		if (typeof selectors[obj.selectors[e].id] !== 'undefined') {
	  			promises.push(utils.db.setDomainSelectors(domainId, selectors[obj.selectors[e].id], obj.selectors[e].selector));
	  			
	  		}
		}
		Q.allSettled(promises).then(function(r){
			console.log('Processed all the selectors');
			process.exit();
		}).catch(function(e){
			console.log('Couldnt process all the selectors');
			console.log(e);
			process.exit();
		})
	}
}

module.exports = Jobs;
