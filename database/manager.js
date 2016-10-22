var connection = require('./connection');

module.exports.query = function(query, param, cb) {
	connection.getConnection(function(err, conn) {
		if (err) throw err;
		conn.query(query, param, cb);
		conn.release();

	})
}