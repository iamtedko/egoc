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
app.get('/test', function(req, res) {
  res.type('text/html');
  res.send(req.query.text);
  webhookUri = "https://hooks.slack.com/services/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";

  slack = new Slack(); 
  slack.setWebhook(webhookUri);

  slack.webhook({
	channel: "@joel",
	username: "webhookbot",
	text: "This is posted to #general and comes from a bot named webhookbot."
	}, function(err, response) {
	console.log(response);
  });

  //return res.redirect('index.html');
});

app.get('/joeltest', function(req, res){
	res.type('text/html');
	//res.send('Worked');
	res.send(req.query['username'] + "and" + req.query['password']);
	//$.post("https://hooks.slack.com/services/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", payload={"text": "This is a line of text in a channel.\nAnd this is another line of text."});
	//res.send(req.query['username']);

	var Slack = require('slack-node');

	webhookUri = "https://hooks.slack.com/services/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";

	slack = new Slack();
	slack.setWebhook(webhookUri);

	slack.webhook({
	  channel: "#slack-currency",
	  username: "webhookbot",
	  text: "This is posted to #slack-currency and comes from a bot named webhookbot."
	}, function(err, response) {
	  console.log(response);
	});
});

app.get('/tedtest', function(req, res){
	res.type('text/html');

	var slack_command = req.query.text;

	//parse the text
	var words = slack_command.split();

	//set the variables for the webhook
	var recipient = words[0];
	var amt = words[1];
	var msg = words[2];

	var Slack = require('slack-node');

	webhookUri = "https://hooks.slack.com/services/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";

	slack = new Slack();
	slack.setWebhook(webhookUri);

	// slack emoji
	slack.webhook({
	  channel: recipient,
	  username: "fist bump",
	  icon_emoji: ":punch:",
	  text: "Someone just gave you a fist bump!"
	}, function(err, response) {
	  console.log(response);
	});

	res.send("You sent gave " + recipient + "a fist bump!");

});





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});