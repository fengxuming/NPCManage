
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var mongooseHidden = require('mongoose-hidden')();

var exhibitionSchema = new Schema({
    organizer:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    cover:{type:mongoose.Schema.Types.ObjectId,ref:"Resource"},
    title:{type:String,required:true},
    info:{type:String,required:true},
    beginDate:{type:Date,required:true},
    parts:[{type:mongoose.Schema.Types.ObjectId,ref:"Part"}],
    endDate:{type:Date,required:true},
    dateCreated:{type:Date,default:Date.now()}
});

exhibitionSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true } });

module.exports = mongoose.model('Exhibition', exhibitionSchema);