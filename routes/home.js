var express = require('express');
var db = require('../db.js');
var router = express.Router();
var loggedIn = false;
var permissionLevel = "";

router.get('/admins', function(req, res, next) {
  if(loggedIn){
    if(permissionLevel!="general"){
      res.render('admins');}
    else{
      res.redirect('/'+permissionLevel);
    }
  }else{
    res.redirect('/');
  }
});

router.get('/general', function(req, res, next) {
  res.render('general');
});

router.get('/', function(req, res, next){
  if(!loggedIn){res.render('home')}else{res.redirect('/' +permissionLevel)};
});

router.get('/logout', function(req,res,next){
  loggedIn=false;
  permissionLevel = "";
  res.redirect('/');
});

router.get('/:role/login/:name', function(req,res,next){
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
      loggedIn=true;
      permissionLevel = req.params['role'];
      res.redirect('/'+permissionLevel);
    }
  });

});

module.exports = router;
