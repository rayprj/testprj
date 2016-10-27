var Promise = require('promise');
var Xray = require('x-ray');
var x = Xray();
var randomUserAgent = require('random-useragent');
var request = require('request');
var utils = require('./utils');

var fs = require('fs');
 

function AmazingSpiderman() {

	this.req = request.defaults({
    	'proxy': 'http://<>:@proxy.crawlera.com:8010'
	});

	var options = {
	    headers: {
	    	'User-Agent': '',
	    	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',

	    },
    	followRedirect: true,
    	
    	ca: fs.readFileSync("./crawlera-ca.crt"),
    	requestCert: true,
    	rejectUnauthorized: true,

    	maxRedirects: 10,
	};


	var getUserAgent = function() {
		return randomUserAgent.getRandom(function (ua) {
			/** @todo - get the allowed browser name from config */
    		return (
    			(ua.browserName === 'Firefox' || ua.browserName === 'Chrome') 
    			&& ua.browserVersion > 20
    			&& (ua.osName === 'Linux' || ua.osName === 'Windows')
    		);
		});
	};

	this.processRequest = function(options, selector, url, resolve, reject) {
		var self=this;
		//console.log('processRequest');
		return new Promise(function(resolve, reject) {
			self.req(options, function (err, response, body) {
				if (err) {
					console.log(err);
	                return reject(err);
	            }
				if (response.statusCode == 200) {
					
					x(body, 'html', selector)(function (err, obj) {
						if (err) {
	                		return reject(err);
	            		}
	            		if (!utils._.isEmpty(obj)) {
	            			return resolve(obj);
	            		} else {
	            			return reject({Error: 'couldnt find any data', selector:selector, url: url});
	            		}	
	            		
					});
				}
			});
		});


	};

	this.request = function(selector, url) {
		
		options.url = url;
		options.headers['User-Agent'] = getUserAgent();
		var parsedUrl = utils.common.parseUrl(url);
		//console.log(parsedUrl);
		if (parsedUrl.hostname != 'localhost') {
			return this.processRequest(options, selector, url);
		} else {
			/* todo - need to remove the proxy settings */
			return this.processRequest(options, selector, url);
		}
			
		
	}
}

module.exports = AmazingSpiderman;
