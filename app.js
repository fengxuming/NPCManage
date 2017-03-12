var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var flash = require("express-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require('bcrypt-nodejs');

var jwt = require('jsonwebtoken');


var routes = require('./routes/index');
var uploads = require("./routes/uploads");
var api = require("./routes/api");
var users = require("./routes/users");
var exhibitions = require("./routes/exhibitions");
var applications = require("./routes/applications");
var messages = require("./routes/messages");
var parts = require("./routes/parts");
var discesses = require("./routes/discuss");
var notes = require("./routes/note");



var User = require("./models/user");



var app = express();

//设置跨域访问
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , x-access-token');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials',true);

  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

var connectionString = 'mongodb://localhost/NPCDatebase';
mongoose.connect(connectionString);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'admin')));

// app.use(session({secret:"fengxuming",cookie:{maxAge: 200000 }}));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

//
// passport.use("local",new LocalStrategy(
//     function (req,res,done)
//     {
//         User.findOne({username:req.username}).populate("roles").exec(function(err, user)
//         {
//             if(err)
//                 throw err;
//             if(user==null)
//             {
//                 return done(null,false,{message:"用户名或者密码错误"});
//             }
//             else
//             {
//                 bcrypt.compare(req.password, user.password, function(err, isMatch) {
//                     if(err) {
//                         throw err;
//                     }
//                     if(isMatch)
//                     {
//                         var content ={msg:"smsb"}; // 要生成token的主题信息
//                         var secretOrPrivateKey="smsb!";
//                         var tokenContent = jwt.sign(content, secretOrPrivateKey, {
//                             expiresIn: 60*60*24  // 24小时过期
//                         });
//                         var token =new Token();
//                         token.user = user._id;
//                         token.tokenContent = tokenContent;
//                         token.dateCreated = Date.now();
//                         token.save(function (err) {
//                             if(err)
//                             {
//                                 return res.send(err);
//                             }
//                         });
//                         return done(null,user);
//                         // return res.json(token);
//                     }
//                     else
//                     {
//                         return done(null,false,{message:"用户名或者密码错误"});
//                     }
//                 });
//
//             }
//         });
//     }
// ));
//
// //保存user对象
// passport.serializeUser(function (user, done) {
//     done(null, user);
// });
//
// //删除user对象
// passport.deserializeUser(function (user, done) {
//     done(null, user);
//
// });
//
//


app.use(function (req, res, next) {
  var url = req.originalUrl;
  var secretOrPrivateKey="npc!";
  var token = req.body.token || req.query.token || req.headers["token"] || req.headers["x-access-token"]; // 从body或query或者header中获取token    jwt.verify(token, secretOrPrivateKey, function (err, decode) {
  if(token){
    jwt.verify(token, secretOrPrivateKey, function (err, decode) {
      if (err) {
        if(url.indexOf("/api") != 0) {
          return res.status(401).send("");
        }
        else {
          next();
        }
      } else {
        req.decode = decode;
        var username = decode.username;
        User.findOne({ username: username}, function(err, user) {
          if (!err) {
            req.user = user;
            next();
          }
        });
      }
    });
  } else {
    if(url.indexOf("/api") == 0  ||url.indexOf("/exhibition")==0 ) {
      next();
    }
    else {
      return res.status(401).send("");
    }


  }
});

app.use('/', routes);
app.use('/uploads', uploads);
app.use("/api",api);
app.use("/users",users);
app.use("/exhibitions",exhibitions);
app.use("/applications",applications);
app.use("/messages",messages);
app.use("/parts",parts);
app.use("/discusses",discesses);
app.use("/notes",notes);


//init admin user
User.initAdmin();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
