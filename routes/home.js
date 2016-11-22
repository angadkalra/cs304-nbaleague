var express = require('express');
var db = require('../db.js');
var router = express.Router();
var permissionLevel = "";

router.get('/home/:role/:name', function(req, res, next) {
  if(req.params["role"] == "general"){
    return res.render('home', {level:"general"});
  }
  query = 'SELECT name FROM ' + req.params['role'] +' WHERE name = \'' +req.params['name']+'\';';
  console.log(query);
  db.query(query, function(error){
    res.render('error');
  },
  function(results){
    console.log(results);
    if(results.hasOwnProperty("Error")){
      res.render('error');	
    }else if(results.length==0){
      res.redirect('/');
    }else{
       permissionLevel=req.params['role'];
       res.render('home', {level: permissionLevel});
    }
  });

});

router.get('/', function(req, res, next){
  res.render('login');
});

router.get('/logout', function(req,res,next){
  permissionLevel = "";
  res.redirect('/');
});

module.exports = router;
