var Promise = require('promise');
var Xray = require('x-ray');
var x = Xray();
var randomUserAgent = require('random-useragent');
var request = require('request');
var utils = require('../utils');
var cheerio = require('cheerio')
var Q  = require('q');
var fs = require('fs');
function ratingPostProcessData(data,urlRow,deferred){
	"use strict";
	//var deferred = Q.defer();
	//console.log(data);
	//TODO - take columns from constants
	utils.db.getAttributesIds(['transformed_product_ratings_five_stars','transformed_product_ratings_four_stars','transformed_product_ratings_three_stars','transformed_product_ratings_two_stars','transformed_product_ratings_one_star']).then(function(catalogMap){
	    var promises = [];
	    for(var i in catalogMap){
	    	promises[promises.length] = utils.db.updateRatings(urlRow.url_id,catalogMap[i],data.rating[i]);
	    }
	    Promise.all(promises).then(function(){
	    	console.log('test')
	    	utils.db.markUrlContent(urlRow.url_id,'1').then(function(){
	    		deferred.resolve();
	    	}).catch(function(){
	    		deferred.reject();
	    	});
	    })
	}).catch(function(e){
		deferred.reject(e);
	})
	//return deferred.promise;
}
module.exports = {
	"wwwbestbuycom":{
		"rating":{
			"preProcessData":function(html,url){
				"use strict";
				return new Promise(function(resolve,reject){
					let $ = cheerio.load(html);
					var param1 = $('#links-model-data').attr('data-bv-url').split("/")[4]
					var param2 = $('[data-sku-id]').attr('data-sku-id');
					url = url.replace('{param1}',param1);
					url = url.replace('{param2}',param2);
					console.log(url)
					resolve(url);
				})				
			},
			"processData":function(html){
				"use strict";

				return new Promise(function(resolve,reject){
					//console.log(html)
					let $ = cheerio.load(html);
					var ratingObj = {"rating":{
						"transformed_product_ratings_five_stars":$('.BVRRHistogramBarRow5 .BVRRHistAbsLabel').html(),
						"transformed_product_ratings_four_stars":$('.BVRRHistogramBarRow4 .BVRRHistAbsLabel').html(),
						"transformed_product_ratings_three_stars":$('.BVRRHistogramBarRow3 .BVRRHistAbsLabel').html(),
						"transformed_product_ratings_two_stars":$('.BVRRHistogramBarRow2 .BVRRHistAbsLabel').html(),
						"transformed_product_ratings_one_star":$('.BVRRHistogramBarRow1 .BVRRHistAbsLabel').html()
					}};
								
					resolve(ratingObj)
				})	
			},
			"postProcessData":function(data,urlRow,deferred){
				"use strict";
				ratingPostProcessData(data,urlRow,deferred);
			}
		}
	},
	"wwwcdwcom":{
		"rating":{
			"preProcessData":function(html,url){
				"use strict";

				return new Promise(function(resolve,reject){
					let $ = cheerio.load(html);
					var param1 = $('body').attr('data-productcode')
					
					url = url.replace('{param1}',param1);
					
					console.log(url)
					resolve(url);
				})				
			},
			"processData":function(html){
				"use strict";

				return new Promise(function(resolve,reject){
					//console.log(html)
					let $ = cheerio.load(html);
					var ratingObj = {"rating":{
						"transformed_product_ratings_five_stars":$('.BVRRHistogramBarRow5 .BVRRHistAbsLabel').html(),
						"transformed_product_ratings_four_stars":$('.BVRRHistogramBarRow4 .BVRRHistAbsLabel').html(),
						"transformed_product_ratings_three_stars":$('.BVRRHistogramBarRow3 .BVRRHistAbsLabel').html(),
						"transformed_product_ratings_two_stars":$('.BVRRHistogramBarRow2 .BVRRHistAbsLabel').html(),
						"transformed_product_ratings_one_star":$('.BVRRHistogramBarRow1 .BVRRHistAbsLabel').html()
					}};
								
					resolve(ratingObj)
				})	
			},
			"postProcessData":function(data,urlRow,deferred){
				"use strict";
				ratingPostProcessData(data,urlRow,deferred);
			}
		}
	},
	"wwwbhphotovideocom":{
		"rating":{
			"preProcessData":function(html,url){
				"use strict";

				return new Promise(function(resolve,reject){
					let $ = cheerio.load(html);
					//console.log('test')
					var param1 = JSON.parse($('.js-hasShipCutoffTimer').attr('data-item')).sku;					
					url = url.replace('{param1}',param1);					
					console.log(url)
					resolve(url);
				})				
			},
			"processData":function(html){
				"use strict";

				return new Promise(function(resolve,reject){
					//console.log(html.trim()	)
					console.log("inside process data");
					var data = JSON.parse(html.trim());
					console.log(data.snapshot.rating_histogram)
					var ratingObj = {"rating":{
						"transformed_product_ratings_five_stars":data.snapshot.rating_histogram['5'],
						"transformed_product_ratings_four_stars":data.snapshot.rating_histogram['4'],
						"transformed_product_ratings_three_stars":data.snapshot.rating_histogram['3'],
						"transformed_product_ratings_two_stars":data.snapshot.rating_histogram['2'],
						"transformed_product_ratings_one_star":data.snapshot.rating_histogram['1']
					}};
								
					resolve(ratingObj)
				})	
			},
			"postProcessData":function(data,urlRow,deferred){
				"use strict";
				console.log("inside post process data");
				ratingPostProcessData(data,urlRow,deferred);
			}
		}
	}
}