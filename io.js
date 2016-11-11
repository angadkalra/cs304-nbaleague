var io = require('socket.io')();
var db = require('./db.js');

io.on('connection', function (socket) {
  socket.on('getAllPlayers', function(query){
    db.handleQuery(query.Operation + " " + query.Columns + " FROM " + query.Table, function(rows, err){
      if(rows){
        socket.emit('queryResults', rows);
      }else{
        socket.emit('error', err);
      }
    });
  });
});

module.exports = io;
