var express = require('express');
var router = express.Router();
var Part = require('../models/part');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var offset = parseInt(req.query.offset || 0);
  var maxSize = parseInt(req.query.maxSize || 20);
  var sort = req.query.sort;
  var order = req.query.order || 'dateCreated';
  if(!sort) sort = -1;
  else if (sort == 'asc'){
    sort = 1;
  } else {
    sort = -1;
  }
  var query = [];
  var pam = {};
  if(req.query.name){
    pam.name = req.query.name;
  }


  query = Part.find(pam).limit(maxSize).skip(offset).sort({dateCreated:sort});
  query.exec(function(err, part) {
    res.json(part);
  });
});

router.post('/', function(req, res, next) {
  var part = new Part(req.body);
  part.dateCreated = Date.now();
  part.validate(function (err) {
    if(err){
      console.log(String(err));
      return res.status(422).send(String(err));
    }else{
      part.save(function(err) {
        res.json(part);
      });
    }
  });
});

router.put('/:id', function(req, res, next) {
  Part.findOne({ _id: req.params.id }, function(err, part) {
    for (prop in req.body) {
      part[prop] = req.body[prop];
    }
    part.validate(function (err) {
      if(err){
        console.log(String(err));
        return res.status(422).send(String(err));
      }else{
        part.save(function(err) {
          res.json(part);
        });
      }
    });

  });
});

router.get('/:id', function (req, res, next) {
  Part.findOne({ _id: req.params.id}, function(err, part) {
    res.json(part);
  });
});

router.delete('/:id', function (req, res, next) {
  Part.remove({
    _id: req.params.id
  }, function(err, part) {
    res.json('');
  });
});

module.exports = router;

