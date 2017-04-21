var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var  mongooseHidden = require('mongoose-hidden')();
var Role = require('../models/role');


var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    avatar:{type:mongoose.Schema.Types.ObjectId,ref:'Resource'},
    realName:{type:String,required:true},
    CN: {type:String,required:true},
    secret:{type:String,required:true},
    password: { type: String},
    email:{type:String},
    phone:{type:String},
    male:{type:Number,default:0},
    idCard:{type:String},
    birth:{type:Date},
    QQ:{type:String},
    address:{type:String},
    userType:{type:String,default:"NPC",required:true,enum:['NPC','admin','organizer']},
    dateCreated: { type: Date, 'default': Date.now }
});

userSchema.pre('save', function (next) {
    if(this.secret){
        var hash = bcrypt.hashSync(this.secret);
        this.password = hash;
    }
    next();
});

userSchema.methods = {
    comparePassword: function (_password, cb) {
        var hash = this.password;
        var isMatch = bcrypt.compareSync(_password, hash);
        cb(null, isMatch);
    }
};

userSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true, password: true } });


userSchema.statics.initAdmin = function () {
    var _this = this;
    _this.findOne({username:"admin"}, function (err, user) {
        if(!user){
            var admin = {"username":"admin", "secret":"12348765", CN:"admin",realName:"admin",role:"admin"};
            var user = new _this(admin);
            user.save(function (err) {
                console.log(user);
            });
        }
    });
    console.log("init admin ...");
};

module.exports = mongoose.model('User', userSchema);