var express = require('express');
var db = require('../db.js');
var router = express.Router();

router.get('/admin', function(req, res, next) {
  res.render('admin');
});

router.get('/coach', function(req, res, next) {
  res.render('coach');
});

router.get('/general', function(req, res, next) {
  res.render('general');
});

// Redirect / to /admin
router.get('/', function(req, res, next){
  res.redirect('/admin');

module.exports = router;
