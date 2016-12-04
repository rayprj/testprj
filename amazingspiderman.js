var Promise = require('promise');
var Xray = require('x-ray');
var x = Xray();
var randomUserAgent = require('random-useragent');
var request = require('request');
var utils = require('./utils');

var fs = require('fs');
var phantom = require('x-ray-phantom');
var config  = require('./config/config.js');
var proxy = config.get('proxy').enabled || false;
var proxyEnv = process.env.PROXY_ENV || '';

var crypto = require('crypto');
var storeContent = true;

//console.log(proxyEnv);
//proxy = true;
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
			proxy: 'http://'+proxyEnv+'@proxy.crawlera.com:8010'
		}
	} else {
		this.options = {};
	}
	this.options.headers = config.get('request').headers;
	

	var getUserAgent = function() {
		return randomUserAgent.getRandom(function (ua) {
			/** @todo - get the allowed browser name from config */
			return (
				(ua.browserName == 'Safari' && ua.browserVersion>4)
				|| 
				(ua.browserName == 'Chrome' && ua.browserVersion>10)
				||
				(ua.browserName == 'Firefox' && ua.browserVersion>10)
			);
		});
	};

	

	this.request = function(urlId, selector, url, events, parentSelector) {
		var parsedUrl = utils.common.parseUrl(url);
		var self=this;
		var eventsToProcess = events || [];
		//console.log(events);
		return new Promise(function(resolve, reject) {
			
			var options = (parsedUrl['hostname'] == 'localhost')?{}:self.options;
			options.url = url;
			options.headers['user-agent'] = getUserAgent();
			//options.headers['referer'] = "";
			//console.log(options);
			var param = {};
			self.req(options, function (err, response, body) {
				if (err) {
					console.log(err);
	                return reject(err);
	            }
				if (response.statusCode == 200) {
					console.log('Page arrived...'+url);
					//console.log('$$$'+events);

					if (config.get('nightmare').enabled) {
						if (utils._.isEmpty(events)) {
							var eventsToProcess = [{type:'wait', argument:2000}];
						} 
					} else {
						if (!utils._.isEmpty(events) 
							&& storeContent
						) {
							param = {"url_id":urlId, "content":body, "status":0};
							var eventsToProcess = [];
						}
					}

					/*var events = [
						{type:'wait', argument:2000},
						{type:'click', argument:'#reviews-accordion > button'},
						{type:'wait', argument:2000},
						{type:'click', argument:'#BVRRQTFilterHeaderToggleShowHistogramsID'},
						{type:'wait', argument:2000},
					]*/

					if (!utils._.isEmpty(eventsToProcess)) {
						var phantomOptions ={"webSecurity":"no", "sslProtocol":"any","proxy":self.options}
						var phantomDriver  = phantom(phantomOptions, function(ctx, nightmare) {
							var n = nightmare.useragent(getUserAgent()).goto(ctx.url);
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
		            			if (!utils._.isEmpty(param)) {
			            				utils.db.setUrlContent(param).then(function(res){
				            			//console.log(res);
				            			console.log('Content inserted... ')
				            			return resolve(obj);
				            		}).catch(function(e){
				            			console.log(e)
				            			return resolve(obj);
				            		})
		            			} else {
		            				return resolve(obj);
		            			}
		            			
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