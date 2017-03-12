var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var mongooseHidden = require('mongoose-hidden')();

var noteSchema = new Schema({
    exhibition:{type:mongoose.Schema.Types.ObjectId,ref:"Exhibition"},
    title:{type:String,required:true},
    content:{type:String,required:true},
    dateCreated:{type:Date,default:Date.now()}
});

noteSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true } });

module.exports = mongoose.model('Note', noteSchema);