var express=require("express");
var app=express();
var port=process.env.PORT||3000;
var fs=require("fs");
var path=require("path");
var mongodb = require("mongodb");//import mongodb drivers
var mongoose=require("mongoose");//import mongodb client

//Connecting to mongodb
mongoose.connect("mongodb://test:test@ds159387.mlab.com:59387/urlshortener");//connect to mongodb
mongoose.connection.on("error", function(err){
  console.log("MongoDB failed to connect because"+err);
  process.exit(-1);
});//exit process and display error in case of error
mongoose.connection.once("open", function(){
  console.log("Connecting to MongoDB successful!");
})//display msg when connected successfully




app.get("/", function(req, res){
  res.sendFile(__dirname+"/index.html",function(err){
    if(err){
      console.log("Sending file failed, err: "+err);
      res.status(err.stats).end();
    } else {
      console.log("HTML indexfile has been sent!");
    }
  });
});

app.listen(port, function(){
  console.log("port listening on port "+port);
});
