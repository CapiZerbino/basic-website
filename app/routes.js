const {checkNotAuthenticated, checkAuthenticated} = require('./../middlewares/check_admin')

var mysql = require('mysql');
var dbconfig = require('./../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', checkNotAuthenticated, function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login',checkNotAuthenticated, passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup',checkNotAuthenticated, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup',checkNotAuthenticated, passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', checkAuthenticated, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	// =====================================
	// SEARCH SECTION =========================
	// =====================================
	app.get('/search', checkAuthenticated, function(req, res) {
		res.render('search.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	app.post('/search', checkAuthenticated, function(req, res) {
		let {name} = req.body;
		let errors = [];
		// console.log(name);
	});
	// =====================================
	// UPDATE SECTION =========================
	// =====================================
	app.get('/update', checkAuthenticated, function(req, res) {
		res.render('update.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	app.post('/update', checkAuthenticated, function(req, res) {
		let {name, phone, address, bank, agencyid, partnerid} = req.body;
		let errors = [];
		console.log(name);
		return res.redirect('/update')
	});
	// =====================================
	// CATEGORY SECTION =========================
	// =====================================
	app.get('/category', checkAuthenticated, function(req, res) {
		connection.query("SELECT * FROM Category",  function(err, rows) {
			if(err){
				console.log(err)
			} else {
				console.log(rows);
				res.render('category.ejs', {categories: rows, user : req.user })
			}
		})
	});
	app.post('/category', checkAuthenticated, function(req, res) {
		let {name} = req.body;
		let errors = [];
		
	});
	
	// =====================================
	// ORDER SECTION =========================
	// =====================================
	app.get('/order', checkAuthenticated, function(req, res) {
		res.render('order.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
