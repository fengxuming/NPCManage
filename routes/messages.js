var express = require('express');
var router = express.Router();
var Message = require('../models/message');

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
  if(req.query.echibition){
    pam.echibition = req.query.echibition;
  }

  query = Message.find(pam).limit(maxSize).skip(offset).sort({dateCreated:sort}).populate("user").populate("reply");
  query.exec(function(err, part) {
    res.json(part);
  });
});

router.post('/', function(req, res, next) {
  var part = new Message(req.body);
  message.dateCreated = Date.now();
  message.validate(function (err) {
    if(err){
      console.log(String(err));
      return res.status(422).send(String(err));
    }else{
      part.save(function(err) {
        res.json(message);
      });
    }
  });
});

router.put('/:id', function(req, res, next) {
  Message.findOne({ _id: req.params.id }, function(err, message) {
    for (prop in req.body) {
      message[prop] = req.body[prop];
    }
    message.validate(function (err) {
      if(err){
        console.log(String(err));
        return res.status(422).send(String(err));
      }else{
        message.save(function(err) {
          res.json(message);
        });
      }
    });

  });
});

router.get('/:id', function (req, res, next) {
  Message.findOne({ _id: req.params.id}, function(err, message) {
    res.json(message);
  });
});

router.delete('/:id', function (req, res, next) {
  Message.remove({
    _id: req.params.id
  }, function(err, message) {
    res.json('');
  });
});

module.exports = router;

