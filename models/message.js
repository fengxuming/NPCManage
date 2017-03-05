
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var mongooseHidden = require('mongoose-hidden')();

var messageSchema = new Schema({
    exhibition:{type:mongoose.Schema.Types.ObjectId,ref:"Exhibition"},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    content:{type:String,required:true},
    reply:{type:mongoose.Schema.Types.ObjectId,ref:"Message"},
    dateCreated:{type:Date,default:Date.now()}
});

messageSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true } });

module.exports = mongoose.model('Message', messageSchema);