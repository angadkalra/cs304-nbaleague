var express = require('express');
var db = require('../db.js');
var router = express.Router();
var permissionLevel = "";

router.get('/adminPage/:role/:name', function(req, res, next) {
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
       if(permissionLevel!="general"){
         res.render('admins', {level: permissionLevel});
       }else{
         res.redirect('/general');
       }
    }
  });

});

router.get('/general', function(req, res, next) {
  res.render('general');
});

router.get('/', function(req, res, next){
  res.render('home');
});

router.get('/logout', function(req,res,next){
  permissionLevel = "";
  res.redirect('/');
});

module.exports = router;
