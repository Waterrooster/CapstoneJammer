var express = require('express');
var bodyParser=require("body-parser");
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/player';   

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var uname,duname='';
var pswd,dpswd='';
var email,demail='';
var playlist;
var played=[];


var insertUser = function(db, callback) {
   db.collection('users').insert( {
	"name":uname,
	"password":pswd,
	"email":email,
	"playlist":[]      
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted new user into the users collection.");
    callback();
  });
};

var findUser = function(db, callback) {
   var cursor =db.collection('users').find( { "name": uname } );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
	duname=doc.name;
	dpswd=doc.password;
	demail=doc.email;
	playlist=doc.playlist;
      } else {
         callback();
      }
   });
};

var updateUsers = function(db, callback) {
   db.collection('users').update({ "name" : duname },
      {
        $set: { "playlist": playlist },
        $currentDate: { "lastModified": true }
      }, function(err, results) {
      console.log(results);
      callback();
   });
};

app.post('/addUser', function(req, res){
    uname=req.body.username;
    pswd=req.body.pswd;
    email=req.body.email;	

	MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);
	findUser(db, function() {
	db.close();
	if(uname===duname){
	  res.sendFile(__dirname +'/views/register.html');
	}else{
	  MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  insertUser(db, function() {
      	  db.close();
  	  });
	  });
	  res.sendFile(__dirname +'/views/login.html');
	}
  	});
	});
	
});

app.post('/checkUser', function(req, res){
    uname=req.body.username;
    pswd=req.body.pswd;
	
	MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);
	findUser(db, function() {
	db.close();
	if(pswd===dpswd){
	  played.length=0;
	  res.sendFile(__dirname +'/views/albums.html');
	}else{
	  res.sendFile(__dirname +'/views/login.html');
	}

  	});
	});
});

app.post('/updatePlayed', function(req, res){
played=req.body;
});

app.get("/getPlayed", function(req, res) {
    res.send(played);
});

app.post('/updatePlayList', function(req, res){
playlist.push(req.body);

});

app.get("/getPlaylist", function(req, res) {
    res.send(playlist);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname +'/views/login.html');
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname +'/views/login.html');
});

app.get('/register', function (req, res) {
  res.sendFile(__dirname +'/views/register.html');
});

app.get('/index', function (req, res) {
  res.sendFile(__dirname +'/views/index.html');
});

app.get('/albums', function (req, res) {
  if(duname===''){
    res.sendFile(__dirname +'/views/login.html');
  }else{
    res.sendFile(__dirname +'/views/albums.html');
  }
});

app.get('/playlist', function (req, res) {
if(duname===''){
    res.sendFile(__dirname +'/views/login.html');
  }else{
  res.sendFile(__dirname +'/views/playlist.html');
  }
});

app.get('/removeAll', function (req, res) {
playlist=[];
  res.sendFile(__dirname +'/views/playlist.html');
});

app.get('/statics', function (req, res) {
if(duname===''){
    res.sendFile(__dirname +'/views/login.html');
  }else{
  res.sendFile(__dirname +'/views/statics.html');
  }
});

app.get('/logout', function (req, res) {
  MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  updateUsers(db, function() {
      db.close();
      duname='';
      res.sendFile(__dirname +'/views/login.html');
  });
});
});

app.listen(3000, function () {
  console.log('Jammer listening on port 3000!');
});

//added comment
