var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  if(req.body.user !=null){
    res.render('home', { title: 'NBA League Homepage', user: req.body.user});
  }else{
    res.redirect('login');
  }
});

router.get('/', function(req, res, next){
  res.redirect('/');
});

module.exports = router;
