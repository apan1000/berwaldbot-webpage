const pg = require('pg');
const express = require('express');
const request = require('request');
const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

if(process.argv[2]) {
	var ngrok = require('ngrok');
	ngrok.connect({
		proto: 'http', // http|tcp|tls 
		addr: 5000, // port or network address
		region: 'eu' // one of ngrok regions (us, eu, au, ap), defaults to us 
	}, function (err, url) {
		if (err) {
			console.error(err);
			process.exit();
		}
		console.log("Website is available at the following URL: " + url);
	});
}

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/spotify', (req, response) => {
	var name = 'kavinsky';

	var options = {
		// url: 'http://api.musicgraph.com/api/v2/artist/suggest?api_key=' +
		// 	process.env.music_graph_key + '&prefix=' + name + '&limit=1',
		url: 'https://api.spotify.com/v1/search?q='+name+'&type=artist',
		headers: {
			'User-Agent': 'request'
		},
		host: 'api.spotify.com'
	}
	request.get(options, (error, resp, body) => {
		if (error || resp.statusCode !== 200) {
			console.log('Could not get artist information.', error);
			response.send(resp.statusCode + resp.body);
		} else {
			var data = JSON.parse(body);
			console.log('Search result:', data);

			if (data.artists.items.length === 0) {
				console.log('No results in artist search. :(');
				response.send('No artist found.');
			} else {
				console.log('Artist data:', data.artists.items[0]);
				let artist = data.artists.items[0];

				response.send(artist.external_urls.spotify);
			}
		}
	});
})

app.get('/emoji', function(request, response) {
  response.send('\u1F60A'+decodeURI('\u2744')+'🎈');
});

app.get('/times', function(request, response) {
  var result = '';
  var times = process.env.TIMES || 5;
  for (i=0; i < times; i++)
	result += i + ' ';
  response.send(result);
});

// app.get('/db', function (request, response) {
//   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
// 	client.query('SELECT * FROM test_table', function(err, result) {
// 		done();
// 		if (err)
// 		{ console.error(err); response.send("Error " + err); }
// 		else
// 		{ response.render('pages/db', {results: result.rows} ); }
// 	});
//   });
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


