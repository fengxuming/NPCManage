/**
 * Created by wangruixia on 16/11/9.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');

// 登录
router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username:username},function (err,user) {
        if(err){
            return res.send(err);
        }
        if(!user){
            return res.status(401).send("");
        }
        user.comparePassword(password,function (err,isMatch) {
            if(err){
                console.log(err)
            }
            if(isMatch){
                var content ={msg:"npc",username:username}; // 要生成token的主题信息
                var secretOrPrivateKey="npc!";
                var token = jwt.sign(content, secretOrPrivateKey, {
                    expiresIn: 60*60*24  // 24小时过期
                });
                // console.log("token ：" +token );
                res.json({
                    success: true,
                    access_token: token,
                    user:user
                });
            }else{
                return res.status(401).send("");
            }
        })
    }).populate("avatar");
});

router.post('/register', function(req, res, next) {
    // res.send('respond with a resource');
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
            _user.secret = req.body.secret;
            _user.save(function(err,user) {
                if (err) {
                    console.log(err);
                }
                res.json(user);
            });


        }
    });
});


// 退出
router.get('/logout', function(req, res) {
    res.json({
        success: true,
        message: '退出成功!'
    });
});

module.exports = router;

