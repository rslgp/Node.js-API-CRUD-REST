var express = require('express');
var router = express.Router();

router.get('/hello', function(req, res, next) {
  var response = {"message": "Hello Cognum!"};
  res.json(response);
});

module.exports = router;
