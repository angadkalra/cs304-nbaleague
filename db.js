var mysql = require('mysql');

var pool      =    mysql.createPool({
  connectionLimit : 100, //important
  host     : 'localhost',
  user     : 'tuple',
  password : 'three',
  database : 'nbaleague',
  debug    :  false
 });

function handleQuery(sqlQuery, callback) {
  pool.getConnection(function(err,connection){
    connection.query(sqlQuery ,function(err,rows){
      connection.release();
      if(!err) {
        console.log("Query: "+sqlQuery+"\n");
        callback(rows)
      }else{
        callback(err)
      }
    });
  });
}

module.exports.handleQuery = handleQuery;
