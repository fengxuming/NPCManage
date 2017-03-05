/**
 * Created by fengxuming on 08/11/2016.
 */
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var  mongooseHidden = require('mongoose-hidden')();

var roleSchema = new Schema({
    roleName:{type:String,required:true},
    dateCreated:{type:Date,default:Date.now()}
});

roleSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true } });

module.exports = mongoose.model('Role', roleSchema);