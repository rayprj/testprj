var csv = require('csv-parser')
var fs = require('fs')

fs.createReadStream('amazon.urls.csv')
  .pipe(csv())
  .on('data', function (data) {
  	console.log(data);
  })