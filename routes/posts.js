const app = require('express')();
const mongoose = require('mongoose');
const router = require('express').Router();
const getUser = require('../midddleware/getUser');

router.get('/', (req, res) => {
	const collection = mongoose.connection.db.collection('posts');
	const cursor = collection.find().toArray().then((result) => {
		res.render('blog', { posts: result, user: req.session.user_type });
	});
});

router.get('/new', (req, res) => {
	res.render('new_post');
});

router.post('/new', getUser, (req, res) => {
	const data = req.body;
	const id = req.session.user;
	mongoose.connection.db.collection('users').findOne({ _id: id }).then((result) => {
		let document = {
			user_id: req.session.user,
			title: data.title,
			content: data.content,
			username: result.username
		};
		mongoose.connection.db.collection('posts').insertOne(document).then(() => {
			console.log(req.session.user + ' created a post');
			res.redirect('/posts');
		});
	});
});

module.exports = router;
