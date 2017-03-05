
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var mongooseHidden = require('mongoose-hidden')();

var applicationSchema = new Schema({
    applicant:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    exhibition:{type:mongoose.Schema.Types.ObjectId,ref:'Exhibition'},
    NPCexperience:{type:String,required:true},
    skills:{type:String,required:true},
    advice:{type:String,required:true},
    otherContact:{type:String,required:true},
    parts:[{type:mongoose.Schema.Types.ObjectId,ref:"Part"}],
    isPass:{type:Number,required:true,default:0},//0 未审核 1 通过 -1 未通过
    decidePart:{type:mongoose.Schema.Types.ObjectId,ref:"Part"},
    dateCreated:{type:Date,default:Date.now()}
});

applicationSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true } });

module.exports = mongoose.model('Application', applicationSchema);