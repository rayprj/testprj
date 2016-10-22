var Promise = require('promise');
var Xray = require('x-ray');
var x = Xray();
var randomUserAgent = require('random-useragent');
var req = require('request');
var utils = require('./utils');

function AmazingSpiderman() {

	var options = {
	    headers: {'User-Agent': ''},
	    host: '218.191.247.51',
	    port: 80,
	    //proxy: 'http://218.191.247.51:80',
	    strictSSL: false
	};

	var getUserAgent = function() {
		return randomUserAgent.getRandom(function (ua) {
			/** @todo - get the allowed browser name from config */
    		return (
    			(ua.browserName === 'Firefox' || ua.browserName === 'Chrome')
    			&& (ua.osName === 'Linux' || ua.osName === 'Windows' || ua.osName == 'Mac OS')
    		);
		});
	};

	this.request = function(selector, url) {
		options.url = url;
		options.headers['User-Agent'] = getUserAgent();

		return new Promise(function(resolve, reject) {

			//console.log(selector);
			req(options, function (err, response, body) {
				if (err) {
	                return reject(err);
	            }
				if (response.statusCode == 200) {
					//console.log(body);
					x(body, 'body', selector)(function (err, obj) {
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
		
	}
}

module.exports = AmazingSpiderman;
