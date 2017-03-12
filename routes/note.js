var express = require('express');
var router = express.Router();
var Note = require('../models/note');

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

  query = Note.find(pam).limit(maxSize).skip(offset).sort({dateCreated:sort}).populate("exhibition");
  query.exec(function(err, part) {
    res.json(part);
  });
});

router.post('/', function(req, res, next) {
  var note = new Note(req.body);
  note.dateCreated = Date.now();
  note.validate(function (err) {
    if(err){
      console.log(String(err));
      return res.status(422).send(String(err));
    }else{
      note.save(function(err) {
        res.json(note);
      });
    }
  });
});

router.put('/:id', function(req, res, next) {
  Note.findOne({ _id: req.params.id }, function(err, note) {
    for (prop in req.body) {
      note[prop] = req.body[prop];
    }
    note.validate(function (err) {
      if(err){
        console.log(String(err));
        return res.status(422).send(String(err));
      }else{
        note.save(function(err) {
          res.json(note);
        });
      }
    });

  });
});

router.get('/:id', function (req, res, next) {
  Note.findOne({ _id: req.params.id}, function(err, note) {
    res.json(note);
  });
});

router.delete('/:id', function (req, res, next) {
  Note.remove({
    _id: req.params.id
  }, function(err, note) {
    res.json('');
  });
});

module.exports = router;

