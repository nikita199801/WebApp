const app = require('express')();
const mongoose = require('mongoose');
const router = require('express').Router();
const session = require('express-session');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
	res.render('login');
});

router.post('/', (req, res) => {
	const collection = mongoose.connection.db.collection('users');
	let data = req.body;
	if (data.username === '' || data.password === '') {
		res.redirect('/login');
	} else {
		collection.findOne({ username: data.username }).then((result) => {
			if (result === null) {
				res.status(403).send('<h1>403 Forbidden</h1> <h3>No user registered</h3><a href = "/home">Home</a>');
			} else {
				bcrypt.compare(data.password, result.password, (err, isSame) => {
					if (!isSame) {
						res.redirect('/login');
					} else {
						req.session.user = result._id;
						req.session.login_status = true;
						req.session.user_type = 'user';
						console.log(`${req.session.user} logged in.`);
						res.redirect('/home');
					}
				});
			}
		});
	}
});
module.exports = router;
