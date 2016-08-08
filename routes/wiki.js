var models = require('../models/');
var Page = models.Page;
var User = models.User;

var express = require('express');
var router = express.Router();
module.exports = router;

router.post('/', function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var title = req.body.title;
	var content = req.body.content;
	var status = req.body.status;
	var page = Page.build({
		title: title,
		content: content,
		status: status
	});
	page.save().then(function(savedPage){res.redirect(savedPage.route);}).catch(next);
});

router.get('/add', function(req, res, next) {
	res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	}).then(function(foundPage) {
		res.render('wikipage', {page: foundPage});
	}).catch(next);
});