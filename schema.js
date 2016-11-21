var mongoose=require("mongoose"),
var Schema=mongoose.Schema;

//Counter Schema - a Schema maps to mongodb
var CounterSchema = Schema ({
  _id:{type:Number, default:0},
  url:String
});
var counters=mongoose.model("counters",CounterSchema);//compiling the schema into a model, which is a class to construct documents

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
      return next(error)
    };
    doc.id=counters.seq;
    next();
  });//findByIdAndUpdate
});//schema.pre

module.exports=mongoose.model("UrlList",URLSchema);
