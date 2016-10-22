var mysql  = require('mysql');
var config = require('../config/config.js');
var pool   = mysql.createPool(config.get('database'));

module.exports = pool;