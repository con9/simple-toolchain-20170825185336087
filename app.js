/*eslint-env node*/

//------------------------------------------------------------------------------
// hello world app is based on node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
var querystring = require('querystring');
var https = require('https');
var host = 'api.us.apiconnect.ibmcloud.com';
app.get('/listHellobm', function (req, res) {
	

    console.log('rec request 1');
	var endpoint = '/myown1org-dev/sb/testapihelloworld/getAllHello';
	var data = '';
	var method = 'GET';
	console.log('rec request 2');
	   performRequest(endpoint, method, data, function (err, data) {
		   console.log('rec request end');
	       console.log( data );
	       res.end( data );
	   });
	});
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

function performRequest(endpoint, method, data, success) {
	console.log('rec request 3');
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };
  console.log('rec request 4');
  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');
    console.log('going to send request');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
//      var responseObject = JSON.parse(responseString);
//      console.log('resp jObj'+responseObject.total_rows);
      success('', responseString);
    });
  });

  req.write(dataString);
  req.end();
}
