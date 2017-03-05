var express = require('express');
var router = express.Router();
var User = require('../models/user');

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
  if(req.query.userType){
    pam.userType = req.query.userType;
  }
  if(req.query.username){
    pam.username = req.query.username;
  }
  if(req.query.status){
    pam.status = req.query.status;
  }

  query = User.find(pam).limit(maxSize).skip(offset).sort({dateCreated:sort}).populate('avatar');
  query.exec(function(err, users) {
    res.json(users);
  });
});

router.post('/', function(req, res, next) {
  User.findOne({username:req.body.username},function (err,has) {//查找账号是否已存在
    if(err){
      console.log(err);
      var errObject=new Object();
      errObject.message = err;
      return res.json(errObject);
    }
    if(has){
      console.log("用户已存在!");
      var hasObject = new Object();
      hasObject.message = "用户已存在";
      return res.json(hasObject);
    }
    else {
      var _user = new User(req.body);
      _user.secret = req.body.password;
      _user.save(function(err,user) {
        if (err) {
          console.log(err);
        }
        res.json(user);
      });

    }
  });
});

router.put('/:id', function(req, res, next) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    for (prop in req.body) {
      user[prop] = req.body[prop];
    }
    user.validate(function (err) {
      if(err){
        console.log(String(err));
        return res.status(422).send(String(err));
      }else{
        user.save(function(err) {
          res.json(user);
        });
      }
    });

  });
});

router.get('/:id', function (req, res, next) {
  User.findOne({ _id: req.params.id}, function(err, user) {
    res.json(user);
  }).populate('roles').populate('avatar');
});

router.delete('/:id', function (req, res, next) {
  User.remove({
    _id: req.params.id
  }, function(err, user) {
    res.json('');
  });
});

module.exports = router;

