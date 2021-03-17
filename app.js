const app = require('express')();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var assert = require('assert');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const port = 3000;
const uri = 'mongodb://localhost:27017/';
const setCookie = require('./midddleware/setCookie.js');
const { rejects } = require('assert');
const login = require('./routes/login');
const profile = require('./routes/profile');
const posts = require('./routes/posts');
const getUser = require('./midddleware/getUser');
app.set('view engine', 'ejs');
mongoose.set('debug', true);

var store = new MongoDBStore({
	uri: uri + 'webapp',
	collection: 'sessions'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	'/',
	session({
		resave: false,
		saveUninitialized: true,
		secret: 'some secret string',
		key: 'MyCookie',
		cookie: { maxAge: 1000 * 60},
		store: store
	})
);

app.use('/login', login);
app.use('/user', profile);
app.use('/posts', posts);

app.get('/home', setCookie, getUser, function(req, res) {
	res.render('index', { login_status: req.session.login_status, user: res.locals.username, id: req.session.user });
});

app.listen(port, () => {
	mongoose
		.connect('mongodb://localhost:27017/webapp', { useUnifiedTopology: true, useNewUrlParser: true })
		.then(() => {
			console.log(`Connected to "webapp" DataBase`);
			console.log(`Application is ready and listening at http://localhost:${port}`);
		});
});
