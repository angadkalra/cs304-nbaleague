var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { users: ['Administrator', 'Coach', 'Player', 'Manager', 'Fan/General'] });
});

module.exports = router;

