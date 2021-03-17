const mongoose = require('mongoose');
const getUser = async (req, res, next) => {
	const collection = mongoose.connection.db.collection('users');
	if (req.session.user != undefined && req.session.user != null) {
		await collection.findOne({ _id: req.session.user }, (err, result) => {
			if (err) {
				console.log('err');
			} else {
				res.locals.username = result.username;
				next();
			}
		});
	} else {
		res.locals.username = 'Guest';
		next();
	}
};

module.exports = getUser;
