var router = require('express').Router();

router.get('/api/speech', (req, res) => {
  console.log("req.query: ", req.query);

  var params = req.query;
  console.log("params: ", params);

  res.send({test: 'test'});

});

module.exports = router;