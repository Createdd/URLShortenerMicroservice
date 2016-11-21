var express=require("express");
var app=express();
var port=process.env.PORT||3000;
var fs=require("fs");
var path=require("path");
var mongodb = require("mongodb");//import mongodb drivers
var mongoose=require("mongoose");//import mongodb client
var urlList=require("./schema.js");//load the schema.js

//Connecting to mongodb
mongoose.connect("mongodb://test:test@ds159387.mlab.com:59387/urlshortener");//connect to mongodb
mongoose.connection.on("error", function(err){
  console.log("MongoDB failed to connect because"+err);
  process.exit(-1);
});//exit process and display error in case of error
mongoose.connection.once("open", function(){
  console.log("Connecting to MongoDB successful!");
})//display msg when connected successfully

//send html file
app.get("/", function(req, res){
  res.sendFile(__dirname+"/index.html",function(err){
    if(err){
      console.log("Sending file failed, err: "+err);
      res.status(err.stats).end();
    } else {
      console.log("HTML indexfile has been sent!");
    }
  });
});//sending a html file

app.listen(port, function(){
  console.log("port listening on port "+port);
});//listen to a port

//lookup a shortened URL
app.get("/:id",function(req,res){
  var id=parseInt(req.params.id,10);
  if(Number.isNaN(id)){
    res.status(404).send("Invalid Short URL");
  } else {
    urlList.find({id:id},function(err,docs){
      if(err){
        res.status(404).send(err);
      }
      if(docs && docs.length){
        res.redirect(docs[0].url);
      } else {
        res.status(404).send("Invalid Short URL");
      }
    });//urlList find
  }
});//send 404 or redirect to docs

//create a new shortened URL
app.get("/new/*?", function(req,res){
  var validUrl=require("valid-url");//add the validation module
  var theUrl=req.params[0];

  if(theUrl && validUrl.isUri(theUrl)){
    urlList.find({url:theUrl}, function(err,docs){
      if(err){
        res.status(404).send(err);
      }
      if(docs && docs.length){
        res.status(201).json({
          "original url":theUrl,
          "short url": "localhost:3000/"+docs[0].id
        });//respond with JSON
      }
    });//find inside the urllist


    urlList.create({url:theUrl},function(req,myUrl){
      if(err){
        return handleError(res,err);
      }
      return res.status(201).json({
        "original url":theUrl,
        "short url": "localhost:3000/"+myUrl.id
      });
    });
  }//if the url is valid
  else {
    res.status(400).json({
      error:"URL invalid"
    });
  }
});//send a new shorted url

//error handler
function handleError(res,err){
  return res.status(500).send(err);
}
