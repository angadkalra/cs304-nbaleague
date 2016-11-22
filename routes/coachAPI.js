var express = require('express');
var db = require('../db');
var router = express.Router();

router.get('/', function(req, res, next) {
  var query = 'SELECT * FROM coaches;';

  db.query(query,
    function(err){
      res.render('error', { message: err.message, error: err });
    },
    function(result){
      res.render('results', { results: result });
    });
});

module.exports = router;
