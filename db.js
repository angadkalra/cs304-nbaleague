var mysql = require('mysql');

var pool      =    mysql.createPool({
  connectionLimit : 100, //important
  host     : '138.197.130.104',
  port     : '3306',
  user     : 'tuple',
  password : 'three',
  database : 'nbaleague',
  debug    :  false
 });

function query(query, error, callback) {
  pool.getConnection(function(err, connection){
    if (err) {
      error(err);
    } else {
      connection.query(query ,function(err, result){
        connection.release();
        if(!err) {
          console.log("Query: " + query + "\n");
	        console.log(result);
          callback(result);
        } else {
          error(err);
        }
      });
    }
  });
}

module.exports.query = query;
