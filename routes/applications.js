var express = require('express');
var router = express.Router();
var Application = require('../models/application');

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
  if(req.query.applicant){
    pam.applicant = req.query.applicant;
  }
  if(req.query.exhibition) {
    pam.exhibition = req.query.exhibition;
  }
  if(req.query.isPass)
  {
    pam.isPass = req.query.isPass;
  }


  query = Application.find(pam).limit(maxSize).skip(offset).sort({dateCreated:sort}).populate({
    path:"applicant",
    model:"User",
    populate:{
      path:"avatar",
      model:"Resource"
    }
  }).populate("exhibition");
  query.exec(function(err, application) {
    res.json(application);
  });
});

router.post('/', function(req, res, next) {
  var application = new Application(req.body);
  application.dateCreated = Date.now();
  application.validate(function (err) {
    if(err){
      console.log(String(err));
      return res.status(422).send(String(err));
    }else{
      application.save(function(err) {
        res.json(application);
      });
    }
  });
});

router.put('/:id', function(req, res, next) {
  Application.findOne({ _id: req.params.id }, function(err, application) {
    for (prop in req.body) {
      application[prop] = req.body[prop];
    }
    application.validate(function (err) {
      if(err){
        console.log(String(err));
        return res.status(422).send(String(err));
      }else{
        application.save(function(err) {
          res.json(application);
        });
      }
    });

  });
});

router.get('/:id', function (req, res, next) {
  Application.findOne({ _id: req.params.id}, function(err, application) {
    res.json(application);
  }).populate({
    path:"applicant",
    model:"User",
    populate:{
      path:"avatar",
      model:"Resource"
    }
  }).populate("exhibition");
});

router.delete('/:id', function (req, res, next) {
  Application.remove({
    _id: req.params.id
  }, function(err, application) {
    res.json('');
  });
});

module.exports = router;

