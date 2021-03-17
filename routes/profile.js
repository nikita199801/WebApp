const app = require('express')();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const { db } = require('../db/models/user');
const ObjectId = require('mongodb').ObjectId;

router.get('/:id', (req, res) => {
	const collection = mongoose.connection.db.collection('users');
	const id = new ObjectId(req.params.id);
	collection.findOne({ _id: id }).then((result, err) => {
		res.render('profile', { user: result });
	});
});

router.get('/', (req, res) => {
	if (req.session.login_status) {
		res.redirect('/home/wall');
	} else {
		res.render('register');
	}
});

router.post('/:id/logout', (req, res) => {
	console.log(`${req.session.user} logged out.`);
	req.session.destroy();
	res.redirect('/home');
});

router.post('/new', (req, res) => {
	const collection = mongoose.connection.db.collection('users');
	const data = req.body;
	bcrypt
		.hash(data.password, 10)
		.then((hash) => {
			let document = { username: data.username, email: data.email, password: hash, photo: data.photo };
			collection.insertOne(document).then(() => {
				console.log('User ' + data.username + ' successfully created!');
				res.redirect('/home');
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
