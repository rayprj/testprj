var Promise = require('promise');
var db      = require('./database/manager');
var config  = require('./config/config.js');
var url  = require('url');
var Q  = require('q');

module.exports = {
	
	_:require('underscore'),

	db: {
		getSelectors: function(domain) {
		    return new Promise(function(resolve, reject) {
		        var queryStr = "SELECT dom.domain, sel.name, dom_sel.selector, dom_sel.selector_id \
		        FROM domains dom INNER JOIN domains_selectors dom_sel \
		        	ON dom.id = dom_sel.domain_id \
		        INNER JOIN selectors sel \
		        	ON sel.id = dom_sel.selector_id ";

		        queryStr += (typeof domain !== 'undefined')? ' WHERE dom.domain = ?': '';

		        param = domain && [domain];

		        var q = db.query(queryStr, param, function (err, rows, fields) {
		            // Call reject on error states,
		            // call resolve with results
		            if (err) {
		            	console.log(err);
		                return reject(err);
		            }
		            var ret = {};
		            for(i=0; i<rows.length; i++) {
		            	ret[rows[i].domain] = ret[rows[i].domain] || {};
		            	ret[rows[i].domain][rows[i].name] = {
		            		selector_id:rows[i].selector_id,
		            		selector: rows[i].selector
		            	}
		            }
		            resolve(ret);
		        });

		    });
		},

		getEvents: function(domain) {
		    return new Promise(function(resolve, reject) {
		        var queryStr = "SELECT dom.domain, dom_sel.event, dom_sel.argument \
		        FROM domains dom INNER JOIN domains_events dom_sel \
		        	ON dom.id = dom_sel.domain_id \
		         ";

		        queryStr += (typeof domain !== 'undefined')? ' WHERE dom.domain = ?': '';

		        param = domain && [domain];

		        var q = db.query(queryStr, param, function (err, rows, fields) {
		            // Call reject on error states,
		            // call resolve with results
		            if (err) {
		            	console.log(err);
		                return reject(err);
		            }
		            var ret = [];
		            for(i=0; i<rows.length; i++) {
		            	ret[rows[i].domain] = ret[rows[i].domain] || [];
		            	ret[rows[i].domain][ret[rows[i].domain].length] = {
		            		type:rows[i].event,
		            		argument: rows[i].argument,
		            	}
		            }
		            resolve(ret);
		        });

		    });
		},

		getAllSelectors: function(domain) {
			return this.query("SELECT * FROM selectors ");
		},

		setUrlData: function(param) {
			return new Promise(function(resolve, reject) {
		        var queryStr = "INSERT INTO urls_data SET ? ";
		        var q = db.query(queryStr, param, function (err, rows, fields) {
		            // Call reject on error states,
		            // call resolve with results
		            if (err) {
		            	console.log(err);
		                return reject(err);
		            }
		            resolve(rows);
		        });

		    });
		},


		setDomainSelectors: function(domainId, selectorId, selector) {
			var deferred = Q.defer();

			
				
			var queryStr = "UPDATE domains_selectors SET ? WHERE domain_id='"+domainId+"' AND selector_id='"+selectorId+"' ";
			db.query(queryStr, {selector:selector}, function (err, rows, fields) {
	            if (err) {
	            	console.log(err);
					deferred.reject(err);
	            }
	            if (rows.affectedRows <= 0) {
	            	var data = {
						domain_id: domainId,
						selector_id: selectorId,
						selector: selector
					};
	            	var queryStr = "INSERT INTO domains_selectors SET ? ";
			        db.query(queryStr, data, function (err, rows, fields) {
			            
			            if (err) {
			            	console.log(err);
			                deferred.reject(err);
			            }

			            deferred.resolve(rows);
			            
			        });
	            } else {
	            	deferred.resolve(rows);
	            }
        	});
			return deferred.promise;
				
		        
		    
		},

		setUrl: function(domainId, url, batchId) {
			var deferred = Q.defer();
			/*var queryString = ' INSERT INTO urls (url, domain_id, status) ';
			queryString += " SELECT * FROM (SELECT '"+url+"', '"+domainId+"', '0') AS tmp ";
			queryString += " WHERE NOT EXISTS (SELECT url FROM urls WHERE url='"+url+"' and status<>0) LIMIT 1";*/
			
			var queryStr = " UPDATE urls SET status=0, date_modified=concat(current_date(),TIME(date_modified)) WHERE url='"+url+"' AND domain_id='"+domainId+"' ";
			//console.log(queryStr);
			db.query(queryStr, function (err, rows, fields) {
	            
	            if (err) {
	            	deferred.reject();
	            	return;
	            }
	            //console.log(rows.affectedRows);
	            if (rows.affectedRows <= 0) {
					
					var queryString = ' INSERT INTO urls (url, domain_id, status) ';
					queryString += " VALUES ('"+url+"', '"+domainId+"', '0') ";

					db.query(queryString, function (err, r, fields) {
						if (err) {
							console.log(err);
							deferred.reject(err);
							return;
						}

						if (r.affectedRows > 0) {
							console.log('setUrl: domain '+domainId+' URL '+url+' inserted ');
							deferred.resolve();
						} else {
							console.log('setUrl: domain '+domainId+' URL '+url+' not inserted ');
							deferred.reject('setUrl: domain '+domainId+' URL '+url+' not inserted ');
						}

					});


	            } else {
	            	console.log('setUrl: domain '+domainId+' URL '+url+' updated to status=0 ');
					deferred.resolve();
	            }

	        });

			
			return deferred.promise;
		},

		setUrlDataDenormal: function(urlId, params, sel, selectors) {

			var deferred = Q.defer();

			var value = (typeof params[sel] != 'undefined')?params[sel]:'';
			value = value.trim();

			var queryStr = "UPDATE urls_data_denormal SET ? WHERE url_id='"+urlId+"' AND selector='"+selectors[sel]['selector_id']+"' ";
			db.query(queryStr, {value:value}, function (err, rows, fields) {
	            
	            if (err) {
	            	deferred.reject();
	            	return;
	            }
	            if (rows.affectedRows <= 0) {

	            	//console.log('inserting...');
	            	var data = {
						url_id: urlId,
						selector: selectors[sel]['selector_id'],
						value: value
					};

	            	var queryStr = "INSERT INTO urls_data_denormal SET ? ";
			        db.query(queryStr, data, function (error, rows, fields) {
			            if (err) {
			            	console.log(error);
			            	deferred.reject();
			            	return;
			                //return reject(error);
			            }
			            deferred.resolve();
			            //return resolve(rows);
			            
			        });
	            } else {
	            	//console.log('data exists.. updated...');
	            	//return resolve(rows);
	            	deferred.resolve();
	            }
        	});
        	return deferred.promise;

		},

		

		getUrls: function(filter, urlProessingLimit) {
			return new Promise(function(resolve, reject) {
		        var queryStr = "SELECT url, id FROM urls ";
		        if (typeof filter !== 'undefined') {
				    queryStr += ' WHERE ';
					for (where in filter) {
						if (filter[where] != '-1') {
							queryStr += ' '+where+' = '+"'"+filter[where]+"' AND ";
						}
					}
					queryStr = queryStr.substring(0, queryStr.lastIndexOf('AND'));
		        }
		        queryStr += ' ORDER BY `id` ASC ' ;

		        if (typeof urlProessingLimit != 'undefined') {
		        	queryStr += ' LIMIT 0, '+urlProessingLimit;
		    	}

		    	//console.log(queryStr);

		        //param = filter && filter;

		        var q = db.query(queryStr, {}, function (err, rows, fields) {
		        	if (err) {
						reject(err);
					}
					resolve(rows);
		        });

		    });
		},

		update: function(table, param, paramCondition) {

			return new Promise(function(resolve, reject) {
		        var queryStr = "UPDATE ?? SET ? WHERE ? ";
		        
		        var q = db.query(queryStr, [table, param, paramCondition], function (err, rows, fields) {
		            // Call reject on error states,
		            // call resolve with results
		            if (err) {
		            	console.log(err);
		                return reject(err);
		            }
		            resolve(rows);
		        });

		    });

		},

		query: function(queryStr, param, paramCondition) {

			return new Promise(function(resolve, reject) {
		        
		        
		        var q = db.query(queryStr, function (err, rows, fields) {
		            // Call reject on error states,
		            // call resolve with results
		            if (err) {
		            	console.log(err);
		                return reject(err);
		            }
		            return resolve(rows);
		        });

		    });

		},

		setDomain: function(domainName, domainId) {
		        
	        var deferred = Q.defer();

	        var queryString = ' INSERT INTO domains (id, domain) ';
			queryString += " VALUES ('"+domainId+"', '"+domainName+"') ";

			db.query(queryString, function (err, r, fields) {
				if (err) {
					console.log(err);
					deferred.reject(err);
				}

				if (r.affectedRows > 0) {
					console.log('setDomain: domainId '+domainId+' domain '+domainName+' inserted ');
					deferred.resolve();
				} else {
					console.log('setDomain: domainId '+domainId+' domain '+domainName+' not inserted ');
					deferred.reject('setDomain: domainId '+domainId+' domain '+domainName+' not inserted ');
				}

			});


	        return deferred.promise;

		}

	},

	transform: {
		before: function(what, rows, row) {

		},

		replace: function(find, replace, rows, row) {

		},

		after: function(what, rows, row) {

		},

		divide: function(top, bottom, rows, row) {

		},

	},

	common: {
		getDomain: function(urlString) {
			return url.parse(urlString).hostname;
		},

		parseUrl: function(urlString) {
			return url.parse(urlString);
		},

		escapeString: function(str) {
    		return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
		        switch (char) {
		            case "\0":
		                return "\\0";
		            case "\x08":
		                return "\\b";
		            case "\x09":
		                return "\\t";
		            case "\x1a":
		                return "\\z";
		            case "\n":
		                return "\\n";
		            case "\r":
		                return "\\r";
		            case "\"":
		            case "'":
		            case "\\":
		            case "%":
		                return "\\"+char; // prepends a backslash to backslash, percent,
		                                  // and double/single quotes
		        }
    		})
		}

	},

}