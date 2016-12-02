var Promise = require('promise');
var Xray = require('x-ray');
var x = Xray();
var randomUserAgent = require('random-useragent');
var request = require('request');
var utils = require('./utils');

var fs = require('fs');
var phantom = require('x-ray-phantom');
var config  = require('./config/config.js');
var proxy = config.get('database').enabled || false;

var crypto = require('crypto');


function AmazingSpiderman() {

	this.req = request.defaults({
    	followRedirect: true,
    	maxRedirects: 10,
	});

	if (proxy) {
		this.options = {
			ca : fs.readFileSync("./crawlera-ca.crt"),
			requestCert: true,
			rejectUnauthorized: true,
			proxy: 'http://<>:@proxy.crawlera.com:8010'
		}
	} else {
		this.options = {};
	}
	this.options.headers = config.get('request').headers;
	

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

	

	this.request = function(selector, url, events, parentSelector) {
		var parsedUrl = utils.common.parseUrl(url);
		var self=this;
		//console.log('processRequest');
		return new Promise(function(resolve, reject) {
			
			var options = (parsedUrl['hostname'] == 'localhost')?{}:self.options;
			options.url = url;
			options.headers['user-agent'] = getUserAgent();
			//options.headers['referer'] = "";
			//console.log(options);

			self.req(options, function (err, response, body) {
				if (err) {
					console.log(err);
	                return reject(err);
	            }
				if (response.statusCode == 200) {
					console.log('Page arrived...'+url);
					console.log(events);

					if (config.get('nightmare').enabled
						&& utils._.isEmpty(events)
					) {
						var events = [{type:'wait', argument:2000}];
					}
					/*var events = [
						{type:'wait', argument:2000},
						{type:'click', argument:'#reviews-accordion > button'},
						{type:'wait', argument:2000},
						{type:'click', argument:'#BVRRQTFilterHeaderToggleShowHistogramsID'},
						{type:'wait', argument:2000},
					]*/

					if (!utils._.isEmpty(events)) {
						var phantomOptions ={"webSecurity":"no", "sslProtocol":"any","proxy":self.options}
						var phantomDriver  = phantom(phantomOptions, function(ctx, nightmare) {
							var n = nightmare.goto(ctx.url);
							for (index in events) {
								var arg = events[index]['argument'];
								if (events[index]['type']=='wait') {
									arg = parseInt(arg);
								}
								n = n[events[index]['type']](arg);
							}
							var md5sum = crypto.createHash('md5');
							var imagePath = md5sum.update(ctx.url).digest("hex");
							n = n.screenshot(config.get('screenshotpath')+'/'+imagePath+'.jpg');
						    return n;
						});

						var xd = Xray().driver(phantomDriver);
						xd(url, selector)(function(err, obj) {
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
					}
				} else {
					return reject({Error: 'Service Unavailable', statusCode: response.statusCode});

				}
			});
		});
		
		
	}
}

module.exports = AmazingSpiderman;
