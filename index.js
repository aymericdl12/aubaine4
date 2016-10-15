var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/cool', function(request, response) {
  response.send(cool());
  console.log('coucou locale');
});

app.get('/times', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
    for (i=0; i < 60; i++)
      result += i + ' ';
  response.send(result);
});

app.get('/db', function(request, response) {
	var MongoClient = require('mongodb').MongoClient;
	var assert = require('assert');
	// Connection URL 
	var url = "mongodb://heroku_73397x48:f6cr0qggse5nb158s6nups3hu3@ds047592.mlab.com:47592/heroku_73397x48";
	// Use connect method to connect to the Server 
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err+"errooor");
		console.log("Connected correctly to server");
		db.close();
		response.send(cool());
	});


});
