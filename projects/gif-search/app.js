var express = require('express');
var app = express();
var exphbs  = require('express-handlebars');
var http = require('http');
var giphy = require('giphy-api')('dc6zaTOxFJmzC');

// assign port to listen to for server
app.listen(3000, function () {
  console.log('Gif Search listening on port localhost:3000!');
});

// tell program to use handlebars as view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// tell express where the static files are
app.use(express.static('public'));

// set up routes and define which routes uses what template from view folder

// gif search without the wrapper
// app.get('/', function (req, res) {
//   console.log(req.query)
//   var queryString = req.query.term;
//
//   // ENCODE THE QUERY STRING TO REMOVE WHITE SPACES AND RESTRICTED CHARACTERS
//   var term = encodeURIComponent(queryString);
//
//   // PUT THE SEARCH TERM INTO THE GIPHY API SEARCH URL
//   var url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC'
//
//   // MAKE GET REQUEST
//   http.get(url, function(response) {
//     // SET ENCODING OF RESPONSE TO UTF8
//     response.setEncoding('utf8');
//
//     var body = '';
//
//     response.on('data', function(d) {
//       // CONTINUOUSLY UPDATE STREAM WITH DATA FROM GIPHY
//       body += d;
//     });
//
//     response.on('end', function() {
//       // WHEN DATA IS FULLY RECEIVED PARSE INTO JSON
//       var parsed = JSON.parse(body);
//       // RENDER THE HOME TEMPLATE AND PASS THE GIF DATA IN TO THE TEMPLATE
//       res.render('home', {gifs: parsed.data})
//     });
//   });
// })

// gif search using the wrapper
app.get('/', function (req, res) {
  giphy.search(req.query.term, function (err, response) {
    res.render('home', {gifs: response.data})
  });
});

app.get('/hello-gif', function (req, res) {
  var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
  res.render('hello-gif', {gifUrl: gifUrl})
})

app.get('/greetings/:name', function (req, res) {
  var name = req.params.name;
  res.render('greetings', {name: name});
})
