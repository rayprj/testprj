var express = require('express');
var app = express();
 
var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Nodeadmin app listening at http://%s:%s", host, port)
})
