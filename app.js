const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');

/* Map global promise - getting rid of warining */
mongoose.Promise = global.Promise;
/* Mongoose Middleware */
/* Connect to mongoose */
/* To work using docker use: mongodb://mongo:27017/smartteach-dev 
   To work using local host use mongodb://localhost:27017/smartteach-dev
*/
const mongoURI = require('./config/database');
const conn = mongoose.createConnection(mongoURI);

conn.once('open', () => {
	console.log('MongoDB Connected...');
	app.emit('ready');
});

const app = express();

/* Handlebars Middleware*/
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

/* Body parser Middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Static Folder, Path middleware */
/* Sets the public folder as the express static */
app.use(express.static(path.join(__dirname, 'public')));

/* Method override Middleware */
app.use(methodOverride('_method'));

/* Session Middleware */
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

/* Flash Middleware */
app.use(flash());

/* Global Variables */
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

/* Load Product Model */
require('./models/Product');
const Product = conn.model('products');

/* Index Route:
	req = request stuff
	res = response stuff
*/
app.get('/', (req, res) => {
	var noMatch = null;
	if (req.query.search) {

		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Product.find({ comments: regex }) // Searching for the materiais of the materia
			.then(products => {
				if (products.length < 1) {
					noMatch = "No products match that query, please try again.";
				}
				res.render('index', {
					products: products
				});
			});

	} else {
		Product.find() // Searching for the materiais of the materia
			.then(products => {
				products.forEach(element => {
					console.log(element.nota);
				});
				res.render('index', {
					products: products
				});
			});
	}
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/* process.env.PORT to deploy to heroku */
const port = process.env.PORT || 5000;

/* Load Routes */
app.on('ready', () => {
	app.listen(port, () => {
		/* back ticks work like format in python 3 */
		console.log(`Server started on port ${port}`);
	});
});
