var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var mongooseHidden = require('mongoose-hidden')();

var discussSchema = new Schema({
    exhibition:{type:mongoose.Schema.Types.ObjectId,ref:"Exhibition"},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    content:{type:String,required:true},
    reply:{type:mongoose.Schema.Types.ObjectId,ref:"Discuss"},
    dateCreated:{type:Date,default:Date.now()}
});

discussSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true } });

module.exports = mongoose.model('Discuss', discussSchema);