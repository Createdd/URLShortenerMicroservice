/* jshint node: true */
/*jshint esversion: 6 */
"use strict";

var mongoose=require("mongoose"),
Schema=mongoose.Schema;

//Counter Schema - a Schema maps to mongodb
var CounterSchema = new Schema ({
  _id:{type:Number, default:0},
  url:String
});
var counters=mongoose.model("counters",CounterSchema);//compiling the schema into a model, which is a class to construct documents. it uses the CounterSchema and is called counters
//URL List Schema
var URLSchema= new Schema({
  id:{type:Number, default:0},
  url:String
});

//Increment the id of the URL for each new URL
URLSchema.pre("save", function(next){
  var doc=this;
  counters.findByIdAndUpdate({_id:"urlid"}, {$inc:{seq:1}}, function(error, counters){
    if(error){
      return next(error);
    }
    doc.id=counters.seq;
    next();
  });//findByIdAndUpdate
});//schema.pre. defining a pre hook for the document. An instance of a schema is a document

module.exports=mongoose.model("UrlList",URLSchema);
