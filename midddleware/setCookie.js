function setCookie(req, res, next) {
	if (req.session.login_status) {
		next();
	} else {
		req.session.login_status = false;
		req.session.user_type = 'guest';
		next();
	}
}

module.exports = setCookie;
