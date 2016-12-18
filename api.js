var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var db     = require('./database/manager');
var config = require('./config/config.js');
var utils = require('./utils');
var AmazingSpiderman =  require('./amazingspiderman')
var async = require('async');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var spidey = new AmazingSpiderman();

//var fs = require("fs");
app.post('/test', function(req, res) {
  if (typeof req.body.url == 'undefined') {
    res.end( JSON.stringify({error:'please provide url'}));


  }
  if (typeof req.body.selector == 'undefined') {
    res.end( JSON.stringify({error:'please provide selector'}));
  }

  utils.db.getEvents().then(function(events) {
      //console.log(req.query.selector);
      var selector = JSON.parse(req.body.selector);
      console.log(selector);
      var url = decodeURI(req.body.url);
      var domainName = utils.common.getDomain(url);
      console.log(url);
      var eventToProcess = events[domainName] || [];

      spidey.request(1, selector, url, eventToProcess).then(function(data) {
        console.log('Got data for '+url);
        res.end( JSON.stringify(data));
      }).catch(function(err){
        res.end( JSON.stringify({error:'no data'}));
      });

  }).catch(function(err) {
    res.end( JSON.stringify(err));
  })


  
});

app.get('/invalid', function (req, res) {
  res.statusCode=503
  res.end();
});


var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at %s", port)

})

/* <?php

$request = new HttpRequest();
$request->setUrl('http://127.0.0.1:8080/test');
$request->setMethod(HTTP_METH_POST);

$request->setHeaders(array(
  'postman-token' => '27aec8e2-4501-76e0-ade6-3c63caf68f7d',
  'cache-control' => 'no-cache',
  'content-type' => 'application/x-www-form-urlencoded'
));

$request->setContentType('application/x-www-form-urlencoded');
$request->setPostFields(array(
  'url' => 'https://www.bhphotovideo.com/c/product/1241273-REG/apple_mm192ll_a_9_7_ipad_pro_128gb.html',
  'selector' => '{"title":"title","best":"#reviewsDestination > div.reviews_wrapper.reviewLoaded > div.reviews_container > div.reviews_inner_container > div.reviews_overall_rating_container > div > div.reviews_top_left > div.reviews_rating_meter_container > div > div:nth-child(1) > div:nth-child(3)"}'
));

try {
  $response = $request->send();

  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
} */
