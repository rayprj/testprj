//

var AmazingSpiderman =  require('./amazingspiderman')
var spidey = new AmazingSpiderman();


var url='https://www.amazon.com/TP-LINK-TL-SG1016DE-16-Port-Gigabit-Tag-Based/dp/B00K4DS67C/ref=sr_1_1?ie=UTF8&qid=1429201005&sr=8-1&keywords=TL-SG1016DE';
var parentSelector = 'html';
var sel = {"title":"title"};
var events = [];


var events = [
	{type:'wait', argument:2000},
	{type: 'click', argument:'#ui-id-9'},
	{type:'wait', argument:3000}
]

var sel = {
	"title":"title",
	"rating": "#reviewsDestination > div.reviews_wrapper.reviewLoaded > div.reviews_container > div.reviews_inner_container > div.reviews_overall_rating_container > div > div.reviews_top_left > div.reviews_score_container > span.reviews_score_based_on_reviews",
	"fullrating": "#reviewsDestination > div.reviews_wrapper.reviewLoaded > div.reviews_container > div.reviews_inner_container > div.reviews_overall_rating_container > div > div.reviews_top_left > div.reviews_rating_meter_container",
	"fiverating": "#reviewsDestination > div.reviews_wrapper.reviewLoaded > div.reviews_container > div.reviews_inner_container > div.reviews_overall_rating_container > div > div.reviews_top_left > div.reviews_rating_meter_container > div > div:nth-child(1) > div:nth-child(3)"
}
var url = 'https://www.bhphotovideo.com/c/product/1241273-REG/apple_mm192ll_a_9_7_ipad_pro_128gb.html';
//console.log(events);

spidey.request(1, sel, url, events).then(function(data) {
		console.log(data);
		process.exit();

	}).catch(function(e) {
		console.log(e);
		process.exit();
	});
