
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var mongooseHidden = require('mongoose-hidden')();

var partSchema = new Schema({
    code:{type:String,required:true},
    name:{type:String,required:true},
    info:{type:String},
    dateCreated:{type:Date,default:Date.now()}
});

partSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true } });

module.exports = mongoose.model('Part', partSchema);