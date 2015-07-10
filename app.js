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
  res.send('An EGOC is looking for you');

  var sender = req.query.user_name;

  webhookUri = "https://hooks.slack.com/services/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";

  slack = new Slack(); 
  slack.setWebhook(webhookUri);

  slack.webhook({
	channel: "@" + sender,
	username: "EGOC",
	icon_emoji: "http://oi58.tinypic.com/ruryq0.jpg",
	text: "This is posted to #general and comes from a bot named webhookbot."
	}, function(err, response) {
	console.log(response);
  });

  //return res.redirect('index.html');
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});