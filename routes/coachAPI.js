var express = require('express');
var db = require('../db');
var router = express.Router();
var helpers = require('./helperFunctions');

router.get('/', function(req,res,next){
  db.query('SELECT * FROM coaches WHERE deleted = 0;', 
    function(err){
      res.render('error', {message: err.message, error: err});
    },
    function(result){
      res.render('results', {results:result});
    });
});

router.get('/:attributes/', function(req,res,next){
  helpers.querySelectAndRoute('coaches', req,res,next);
});  


router.get('/:attributes/:conditions/:operators/:boundaries', function(req,res,next){
  helpers.querySelectAndRoute('coaches', req,res,next);
});  


router.get('/:attributes/:conditions/:operators/:boundaries/:logic', function(req,res,next){
  helpers.querySelectAndRoute('coaches', req, res, next);
});  


module.exports = router;
