/** this is the testing playground */
var Xray = require('x-ray');
var x = Xray();
var randomUserAgent = require('random-useragent');
var req = require('request');
var db = require('./database/manager');
var utils = require('./utils');
var jobs = require('./jobs');

/*result = db.query('SELECT * FROM selectors', {}, function(error, results, fields) {
			if (error) throw error;

			console.log(results);
		});*/


/*utils.getSelectors()
.then(function(rows){
	console.log(rows);
})
.catch(function(err) {
	console.log(err);
});*/


//console.log(utils.getDomain("http://www.amazon.in/MOSHI-Trendy-Plastic-Mobile-iPhone/dp/B01LQAURMS"));

jobs.processUrls({status:0});

return;

//var url = 'http://www.amazon.in/Kuzy-Glare-Screen-Protector-Macbook/dp/B00C1KK9HG?tag=googinhydr18418-21&kpid=B00C1KK9HG&tag=googinkenshoo-21&ascsubtag=27ada124-ea36-4a40-aabf-5c34829469c0';
var url = 'http://www.amazon.in/gp/product/B009HHY4NQ/ref=pd_sim_147_2?ie=UTF8&psc=1&refRID=11G857BYGBYEC755JSSF';

function URLs() {

	urls = [
	"http://localhost:8080/",
	"http://www.amazon.in/MOSHI-Trendy-Plastic-Mobile-iPhone/dp/B01LQAURMS", 
	"http://www.amazon.in/MOSHI-Stylish-Plastic-Mobile-iPhone/dp/B01LQATUI0",
	"http://www.amazon.in/Moto-Plus-4th-Gen-White/dp/B01DDP85BY", 
	"http://www.amazon.in/Gfive-Mobile-Phone-White-Color/dp/B01CR2RFTM",
	"http://www.amazon.in/kenxinda-Mini-Mobile-white-color/dp/B0191YR3X2",
	"http://www.amazon.in/Kgtel-Touch-Screen-Mobile-Phone/dp/B01D8U3HVC",
	"http://www.amazon.in/Amrapali-White-Color-Mobile-Stand/dp/B00QM4ZWQK",
	"http://www.amazon.in/Touch-Mobile-Credit-Holder-ZT10194/dp/B00W7QO9I4",
	"http://www.amazon.in/Moto-3rd-Generation-White-16GB/dp/B01AIP37HE",
	"http://www.amazon.in/JIN-FEINI-Genuine-Leather-Samsung/dp/B01LQAUQLU",
	"http://www.amazon.in/Coolpad-Note-Lite-Glacier-White/dp/B019Z8SG1M",
	"http://www.amazon.in/YU-Yureka-Plus-Alabaster-White/dp/B011HZ00JC",
	"http://www.amazon.in/Cyrus-Touch-Keyboad-Mobile-Colour/dp/B01JYS6BB0",
	"http://www.amazon.in/KGENT-3-Touch-Screen-Mobile-Phone/dp/B01BDRV53E",
	"http://www.amazon.in/Ultra-ZT11101-Transparent-Mobile-Cover/dp/B00WA8ORAY",
	"http://www.amazon.in/Transparent-Diamond-Printed-Mobile-iPhone/dp/B01LQATJHW"
	];

	this.get = function() {
		return urls;
	}

}


function scraper() {

	var options = {
	    headers: {'User-Agent': ''},
	    host: '218.191.247.51',
	    port: 80,
	    //proxy: 'http://218.191.247.51:80',
	    strictSSL: false
	};

	var selector = {
		amazon: {
	  		price: 'td.a-span12 span.a-size-medium',
	  		title: 'title',
	  		sold: 'div#shipsFromSoldBy_feature_div.feature div.a-section a:nth-of-type(1)',
	  		delivery: 'td.a-span12 span.a-size-base',
	  		three_rating: 'td.a-nowrap:nth-of-type(3) a.a-link-normal',
	  		five_rating: 'td.a-nowrap:nth-of-type(5) a.a-link-normal',
	  		date_first_available: 'tr.date-first-available:contains(\'Date First Available\') td.value',
	  		description: 'div.a-row div.a-section p',
	  		image: 'div.imgTagWrapper img.a-dynamic-image@src',
		}
	}

	var getUserAgent = function() {
		return randomUserAgent.getRandom(function (ua) {
    		return (
    			(ua.browserName === 'Firefox' || ua.browserName === 'Chrome')
    			&& (ua.osName === 'Linux' || ua.osName === 'Windows' || ua.osName == 'Mac OS')
    		);
		});
	};

	this.request = function(url) {
		
		options.url = url;
		options.headers['User-Agent'] = getUserAgent();
		console.log(options.headers);
		req(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	//console.log(body);
		    x(body, 'body', selector.amazon)(function (err, obj) {
		    	console.log(obj);
		    });

		  }
		});
	}
}
var s = new scraper();
var u = new URLs();
var urls = u.get();
for(i=0; i<urls.length; i++) {
	s.request(urls[i]);	
	break;
}
//console.log(data);
