var express = require('express');
var models = require('./models/index.js');
var router = require('./routes/wiki.js');
var server = express();
var swig = require('swig');
var path = require('path');
var bodyParser = require('body-parser');

server.set('views', __dirname + '/views');
server.set('view engine', 'html');
server.engine('html', swig.renderFile);
swig.setDefaults({cache: false});

models.User.sync({}).then(function () {
	return models.Page.sync({});
}).then(function(){
	server.listen(3001, function(){
		console.log('Server is listening on port 3001!');
	});
}).catch(console.error);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use('/static', express.static(__dirname + '/views'));
server.use('/wiki', router);
