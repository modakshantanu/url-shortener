// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;



// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


app.get("/new/:url",function (request, response) {
  var url = request.params.url;
    if(url.search(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)!==-1){
    var dburl = 'mongodb://'+process.env.USER+  ':'+ process.env.PASSWORD+'@ds251807.mlab.com:51807/myurlshortenerlololol';
     
    MongoClient.connect(dburl, function (err, parentDB) {
      if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', dburl);
        
        
        
        var db= parentDB.db("myurlshortenerlololol");
        var urlCollection = db.collection("urls");
        var counterCollection = db.collection("counter");
        
        
        var count;
   
        urlCollection.find({url:{$eq:url}}).toArray(function(err,array){
          
          
          if(array.length!==0){
            var result = {
              original:array[0].url,
              short:"https://url-shortner.glitch.me/"+array[0].short
            };
            
            
            
            response.end(JSON.stringify(result)); 
            return;
          }
        });
        
        
        
        var counterCursor = counterCollection.find();
        counterCursor.toArray(function(err,array){
          if (err) throw err;
          
          count = array[0].counter;  
          var object = {
            "url":url,
            "short":count
          }
          
          
          
          counterCollection.update(
            {},
            { $inc:{counter: 1}}
          
          
            
            
        );
          
          urlCollection.insert(object);
          
          
          
          response.end(JSON.stringify({
            original:object.url,
            short:"https://url-shortner.glitch.me/"+object.short
          
          }));
          
          
          
        });
    
        
    }
    });
    
  }else{
  
    response.end("Invalid URL");
    
  }
  
  
});

app.get("/:id",function(req,res){
  
  var dburl = 'mongodb://'+process.env.USER+  ':'+ process.env.PASSWORD+'@ds251807.mlab.com:51807/myurlshortenerlololol';
     
  var short = req.params.id;
  MongoClient.connect(dburl, function (err, parentDB) {
      if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', dburl);
        
        
        
        var db= parentDB.db("myurlshortenerlololol");
        var urlCollection = db.collection("urls");
        var counterCollection = db.collection("counter");
        
        var query = {};
        query["short"] = +req.params.id;
        

        
        urlCollection.find(query).toArray(function(err,result){
        
          if(result.length!==0)
          {
           
            res.redirect("http://"+result[0].url);
            res.end();
          }else{
           
            res.end("Url not found");
          }
        
        });
        
        
        
        
        
      }
    });
    
                      
});
        
  
  
  


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
