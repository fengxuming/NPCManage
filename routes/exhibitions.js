var express = require('express');
var router = express.Router();
var Exhibition = require('../models/exhibition');

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
  if(req.query.organizer){
    pam.organizer = req.query.organizer;
  }
  if(req.query.title) {
    var keyword = req.query.title;
    var reg = new RegExp(keyword, 'i');
    pam.$or = [{'title':{$regex : reg}}];
  }


  query = Exhibition.find(pam).limit(maxSize).skip(offset).sort({dateCreated:sort}).populate('organizer').populate("cover").populate("parts");
  query.exec(function(err, exhibition) {
    res.json(exhibition);
  });
});

router.post('/', function(req, res, next) {
  var exhibition = new Exhibition(req.body);
  exhibition.dateCreated = Date.now();
  exhibition.validate(function (err) {
    if(err){
      console.log(String(err));
      return res.status(422).send(String(err));
    }else{
      exhibition.save(function(err) {
        res.json(exhibition);
      });
    }
  });
});

router.put('/:id', function(req, res, next) {
  Exhibition.findOne({ _id: req.params.id }, function(err, exhibition) {
    for (prop in req.body) {
      exhibition[prop] = req.body[prop];
    }
    exhibition.validate(function (err) {
      if(err){
        console.log(String(err));
        return res.status(422).send(String(err));
      }else{
        exhibition.save(function(err) {
          res.json(exhibition);
        });
      }
    });

  });
});

router.get('/:id', function (req, res, next) {
  Exhibition.findOne({ _id: req.params.id}, function(err, user) {
    res.json(user);
  }).populate('organizer').populate("cover").populate("parts");
});

router.delete('/:id', function (req, res, next) {
  Exhibition.remove({
    _id: req.params.id
  }, function(err, exhibition) {
    res.json('');
  });
});

module.exports = router;

