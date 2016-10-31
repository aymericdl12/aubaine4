var express = require('express');
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var cool = require('cool-ascii-faces');

var DEALS_COLLECTION = "deals";// Connection URL 
var db_url = "mongodb://heroku_73397x48:f6cr0qggse5nb158s6nups3hu3@ds047592.mlab.com:47592/heroku_73397x48";

// app.set('port', (process.env.PORT || 5000));

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(db_url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// DEALS API ROUTES BELOW


/*  "/deals"
 *    GET: finds all deals
 *    POST: creates a new deal
 */

app.get("/deals", function(req, res) {
    var category="boutiques";
    console.dir(req.query)
  if (req.query.category) {
    category=req.query.category;
    console.log("category detectee :) :");
    console.log(req.query.category);
  }
  else{    
    console.log("category non detectee :(  :");
    console.log(req.query.category);
  }
  db.collection(DEALS_COLLECTION).find({"category": category}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get deals.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/deals", function(req, res) {
  var newDeal = req.body;
  newDeal.createDate = new Date();

  if (!(req.body.titre && req.body.descri && req.body.lat && req.body.longitude)) {
    handleError(res, "Invalid deal input", "Must provide a title, description, lat and long.", 400);
  }

  db.collection(DEALS_COLLECTION).insertOne(newDeal, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new deal.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/deals/:id"
 *    GET: find deal by id
 *    PUT: update deal by id
 *    DELETE: deletes deal by id
 */

app.get("/deals/:id", function(req, res) {
  db.collection(DEALS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get deal");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/deals/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DEALS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update deal");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/deals/:id", function(req, res) {
  db.collection(DEALS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete deal");
    } else {
      res.status(204).end();
    }
  });
});




// TO BE REMOVED

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// app.get('/cool', function(request, response) {
//   response.send(cool());
//   console.log('coucou github');
// });

// app.get('/times', function(request, response) {
//     var result = ''
//     var times = process.env.TIMES || 5
//     for (i=0; i < 60; i++)
//       result += i + ' ';
//   response.send(result);
// });

// app.get('/db', function(request, response) {
// 	var MongoClient = require('mongodb').MongoClient;
// 	var assert = require('assert');
	
// 	// Use connect method to connect to the Server 
// 	MongoClient.connect(url, function(err, db) {
// 		assert.equal(null, err);
// 		console.log("Connected correctly to server");
// 		db.close();
// 		response.send(cool());
// 	});
// });
