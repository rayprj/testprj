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

			return new Promise(function(resolve, reject) {
				
				var queryStr = "UPDATE domains_selectors SET ? WHERE domain_id='"+domainId+"' AND selector_id='"+selectorId+"' ";
				db.query(queryStr, {selector:selector}, function (err, rows, fields) {
		            if (err) {
		            	console.log(err);
		                return reject(err);
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
				                return reject(err);
				            }

				            return resolve(rows);
				            
				        });
		            } else {
		            	return resolve(rows);
		            }
	        	});

				
		        
		    });
		},


		setUrlDataDenormal: function(urlId, params, sel, selectors) {

			var deferred = Q.defer();

			var value = (typeof params[sel] != 'undefined')?params[sel]:'';
			value = value.trim();

			var queryStr = "UPDATE urls_data_denormal SET ? WHERE url_id='"+urlId+"' AND selector='"+selectors[sel]['selector_id']+"' ";
			db.query(queryStr, {value:value}, function (err, rows, fields) {
	            
	            if (err) {
	            	deferred.reject();
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
			                return reject(error);
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
		        queryStr += (typeof filter !== 'undefined')? ' WHERE ? ': '';
		        queryStr += ' ORDER BY `id` ASC ' ;

		        if (typeof urlProessingLimit != 'undefined') {
		        	queryStr += ' LIMIT 0, '+urlProessingLimit;
		    	}


		        param = filter && filter;

		        var q = db.query(queryStr, param, function (err, rows, fields) {
		        	if (err) {
						reject(err);
					}

					if (rows.length > 0) {
						/*var inStr = '';
						for(i=0; i<rows.length; i++) {
							inStr += rows[i].id+',';
						}
						var inStr = inStr.substring(0, inStr.length-1);
						var updateQuery = 'UPDATE urls SET status=1 WHERE id ';
			        	updateQuery += 'IN ('+inStr+') ';
			        		
						db.query(updateQuery, param, function(err, updates, fields) {
							if (err) {
								console.log(err);
								reject(err);
							}
							resolve(rows);
						});*/

						resolve(rows);

					} else {
						resolve(rows);
					}
		        	

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
		            resolve(rows);
		        });

		    });

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