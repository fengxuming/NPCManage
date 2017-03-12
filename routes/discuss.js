var express = require('express');
var router = express.Router();
var Discuss = require('../models/discuss');

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
  var pam = {};
  if(req.query.echibition){
    pam.echibition = req.query.echibition;
  }

  query = Discuss.find(pam).limit(maxSize).skip(offset).sort({dateCreated:sort}).populate("exhibition").populate({
    path:"user",
    model:"User",
    populate:{
      path:"avatar",
      model:"Resource"
    }
  }
  );
  query.exec(function(err, part) {
    res.json(part);
  });
});

router.post('/', function(req, res, next) {
  var discuss = new Discuss(req.body);
  discuss.dateCreated = Date.now();
  discuss.validate(function (err) {
    if(err){
      console.log(String(err));
      return res.status(422).send(String(err));
    }else{
      discuss.save(function(err) {
        res.json(discuss);
      });
    }
  });
});

router.put('/:id', function(req, res, next) {
  Discuss.findOne({ _id: req.params.id }, function(err, discuss) {
    for (prop in req.body) {
      discuss[prop] = req.body[prop];
    }
    discuss.validate(function (err) {
      if(err){
        console.log(String(err));
        return res.status(422).send(String(err));
      }else{
        discuss.save(function(err) {
          res.json(discuss);
        });
      }
    });

  });
});

router.get('/:id', function (req, res, next) {
  Discuss.findOne({ _id: req.params.id}, function(err, discuss) {
    res.json(discuss);
  }).populate("exhibition").populate({
        path:"user",
        model:"User",
        populate:{
          path:"avatar",
          model:"Resource"
        }
      }
  );
});

router.delete('/:id', function (req, res, next) {
  Discuss.remove({
    _id: req.params.id
  }, function(err, discuss) {
    res.json('');
  });
});

module.exports = router;

