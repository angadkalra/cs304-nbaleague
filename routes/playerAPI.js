var express = require('express');
var db = require('../db.js');
var router = express.Router();

router.get('/', function(req, res, next) {
  db.query("SELECT * FROM players;",
    function(err) {
      console.log(err);
    },
    function(result) {
      res.render('results', { results: result });
    });
});

router.get('/player/:attr/:cond/:op/:val', function(req, res, next) {
  var op = "=";
  switch (req.params.op) {
    case "gt":
      op = ">";
      break;
    case "gte":
      op = ">=";
      break;
    case "lt":
      op = "<";
      break;
    case "lte":
      op = "<=";
      break;
    case "neq":
      op = "!=";
      break;
    case "eq":
      op = "=";
      break;
    default:
      op = "";
    }

  db.query("SELECT " + req.params.attr + " FROM players WHERE " + req.params.cond + op + req.params.val + ";",
    function(err) {
      console.log(err);
    },
    function(result) {
      res.render('results', { results: result });
    });
});

module.exports = router;
