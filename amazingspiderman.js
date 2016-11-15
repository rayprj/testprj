var Promise = require('promise');
var Xray = require('x-ray');
var x = Xray();
var randomUserAgent = require('random-useragent');
var request = require('request');
var utils = require('./utils');

var fs = require('fs');
 

function AmazingSpiderman() {

	this.req = request.defaults({
	    headers: {
	    	'User-Agent': '',
	    	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	    },
    	followRedirect: true,
    	maxRedirects: 10,
	});


	this.options = {
		ca : fs.readFileSync("./crawlera-ca.crt"),
		requestCert: true,
		rejectUnauthorized: true,
		proxy: 'http://<>:@proxy.crawlera.com:8010'
	}
	

	var getUserAgent = function() {
		return randomUserAgent.getRandom(function (ua) {
			/** @todo - get the allowed browser name from config */
    		return (
    			(ua.browserName === 'Firefox' || ua.browserName === 'Chrome') 
    			&& ua.browserVersion < 5
    			&& (ua.osName === 'Linux' || ua.osName === 'Windows')
    		);
		});
	};

	

	this.request = function(selector, url, parentSelector) {
		var parsedUrl = utils.common.parseUrl(url);
		var self=this;
		//console.log('processRequest');
		return new Promise(function(resolve, reject) {
			
			var options = (parsedUrl['hostname'] == 'localhost')?{}:self.options;
			options.url = url;
			options['User-Agent'] = getUserAgent();
			//console.log(options);

			self.req(options, function (err, response, body) {
				if (err) {
					console.log(err);
	                return reject(err);
	            }
				if (response.statusCode == 200) {
					console.log('Page arrived...'+url);
					if (utils._.isEmpty(parentSelector)) {
						parentSelector = 'html';
					}
					x(body, parentSelector, selector)(function (err, obj) {
						if (err) {
	                		return reject(err);
	            		}
	            		if (!utils._.isEmpty(obj)) {
	            			return resolve(obj);
	            		} else {
	            			return reject({Error: 'couldnt find any data', selector:selector, url: url});
	            		}	
	            		
					});
				} else {
					return reject({Error: 'Service Unavailable', statusCode: response.statusCode});

				}
			});
		});
		
		
	}
}

module.exports = AmazingSpiderman;
