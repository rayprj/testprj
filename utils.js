var Promise = require('promise');
var db      = require('./database/manager');
var config  = require('./config/config.js');
var url  = require('url');

module.exports = {
	
	_:require('underscore'),

	db: {
		getSelectors: function(domain) {
		    return new Promise(function(resolve, reject) {
		        var queryStr = "SELECT dom.domain, sel.name, dom_sel.selector \
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
		            	ret[rows[i].domain][rows[i].name] = rows[i].selector;
		            }
		            resolve(ret);
		        });

		    });
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

		getUrls: function(filter) {
			return new Promise(function(resolve, reject) {
		        var queryStr = "SELECT url, id FROM urls ";
		        queryStr += (typeof filter !== 'undefined')? ' WHERE ? ': '';

		        param = filter && filter;

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

		}
	},

	common: {
		getDomain: function(urlString) {
			return url.parse(urlString).hostname;
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