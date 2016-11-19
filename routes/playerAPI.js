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

router.get('/:attributes/:conditions/:operators/:constraints/:logic', function(req, res, next) {

  // these are the attributes we want to include in query
  var attributes = req.params["attributes"].split('-');
  
  if("conditions" in req.params){
    var conditions = req.params["conditions"].split('-');
    var operators = req.params["operators"].split('-');
    var constraints = req.params["constraints"].split('-');
   
    if(conditions.length != operators.length || conditions.length != constraints.length) 
      return "error";
  }

  if("logic" in req.params){
    var logic = req.params["logic"].split('-'); 
  }

  var sqlQuery = (attributes.length == 2 && attributes[1] == "") ? "SELECT name FROM players WHERE " : 
    "SELECT name, " + attributes.join(", ") + " FROM players WHERE ";

  for (var i = 0; i < operators.length; i++) {
    if (operators[i] == "eq")
      operators[i] = "=";

    if(i == conditions.length - 1) {
      sqlQuery += conditions[i] + operators[i] + constraints[i] + ";";
    }
    else {
      sqlQuery += conditions[i] + operators[i] + constraints[i] + " " + logic[i] + " ";
    }
  }

  db.query(sqlQuery,
    function(err) {
      console.log(err);
    },
    function(result) {
      res.render('results', { results: result });
    });
});

module.exports = router;
