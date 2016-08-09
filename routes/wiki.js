var models = require('../models/');
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');
var express = require('express');
var router = express.Router();
module.exports = router;

router.post('/', function(req, res, next) {
	User.findOrCreate({
		where: {
			name: req.body.name,
			email: req.body.email
		}
	}).then(function(values) {
		var user = values[0];
		var page = Page.build({
			title: req.body.title,
			content: req.body.content,
			status: req.body.status
		});

		return page.save().then(function(page) {
			console.log("this is page" + page);
			return page.setAuthor(user);
		});

	}).then(function(page) {
		res.redirect(page.route);
	}).catch(next);
});

router.get('/add', function(req, res, next) {
	res.render('addpage');
});

router.get('/users', function(req, res, next) {
	User.findAll({
		attributes: ['name', 'uid']
		// order: [['title', 'DESC']]
	}).then(function(users) {
		res.render('users', {users: users});
	});
});

router.get('/users/:userId', function(req, res, next) {
	var userPromise = User.findById(req.params.userId);
  var pagesPromise = Page.findAll({
    where: {
      authorUid: req.params.userId
    }
  });

  Promise.all([
    userPromise,
    pagesPromise
  ])
  .then(function(values) {
    var user = values[0];
    var pages = values[1];
    res.render('user', { user: user, pages: pages });
  })
  .catch(next);
});

router.get('/:urlTitle', function(req, res, next) {
	var page = Page.findOne({
		where: {
			urlTitle: req.params.urlTitle,
		},
		include: [{model: User, as: 'author'}]
	}).then(function(foundPage) {
		if(foundPage===null){
			res.status(404).send();
		} else {
		  res.render('wikipage', {page: foundPage});
		}
	}).catch(next);
});

router.get('/', function(req, res, next) {
	Page.findAll({
		attributes: ['title', 'urlTitle'],
		// order: [['title', 'DESC']]
	}).then(function(pages) {
		res.render('index', {pages: pages});
	});
});
