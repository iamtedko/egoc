var express = require('express');
var http = require('http');
var path = require('path');
var exec = require('child_process').exec;
var util = require('util');
var Slack = require('slack-node');

var _ = require('underscore');

/* SETUP EXPRESS */
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// Points to static directory
app.use("/toolkit", express.static(path.join(__dirname, '/app/toolkit')));

app.use("/slacktip", express.static(path.join(__dirname, '/app/slacktip')));

/* ROUTES */
// Redirects to index.html, seems to be required for heroku
app.get('/egoc', function(req, res) {
  res.type('text/html');
  res.send('You initiated an EGOC greeting!');

  var recipient = String(req.query.text);

  webhookUri = "https://hooks.slack.com/services/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";

  var egoc_message = "";

  var rando = parseInt(Math.random() * 10);

  switch (rando % 3) {
  	case 0: egoc_message = "EEEEEGOOOOOOOCCCCCC"; break;
  	case 1: egoc_message = "WHEEEEEEEEEE"; break;
  	case 2: egoc_message = "merp."; break;
  }

  slack = new Slack(); 
  slack.setWebhook(webhookUri);

  slack.webhook({
	channel: recipient,
	username: "EGOC",
	icon_emoji: "http://oi58.tinypic.com/ruryq0.jpg",
	text: egoc_message
	}, function(err, response) {
	console.log(response);
  });

  //return res.redirect('index.html');
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});