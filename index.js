//imports and names modules
const express = require('express');
	morgan = require('morgan');
	fs = require('fs');
	path = require('path');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

//setting up Mongo
const Movies = Models.Movie;
const Users = Models.User;
//mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//setting up morgan, static, body-parser, auth, and passport
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
const cors = require('cors');
app.use(cors());
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


//creating the write stream and creating logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

//ensures fresh data rather than cached data (for updates)
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store');
	next();
})

//GET
app.get('/', (req, res) => {
	res.send('Get ready for the top queer films!');
});

app.get('/documentation',  passport.authenticate('jwt', { session: false }), (req, res) => {
	res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
	await Movies.find()
		.then((movies) => {
			res.status(201).json(movies);
			console.log("movies returned: " + movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

app.get('/secreturl',  passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.send('Consider this an easter egg.');
});

app.get('/movies/:Title',  passport.authenticate('jwt', { session: false }), async (req, res) => {
	await Movies.findOne({ Title: req.params.Title })
		.then((movies) => {
			res.status(201).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

app.get('/movies/genre/:genre',  passport.authenticate('jwt', { session: false }), async (req, res) => {
	await Movies.find({ 'Genre.Name': req.params.genre })
	.then((movies) => {
		res.status(201).json(movies);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

app.get('/movies/director/:director',  passport.authenticate('jwt', { session: false }), async (req, res) => {
	await Movies.find({ 'Director.Name': req.params.director })
	.then((movies) => {
		res.status(201).json(movies);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

app.get('/users',  passport.authenticate('jwt', { session: false }), async (req, res) => {
	await Users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

app.get('/users/:Username',  passport.authenticate('jwt', { session: false }), async (req, res) => {
	await Users.findOne({ Username: req.params.Username })
	.then((user) => { 
		res.json(user);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

//POST
app.post('/users', 
	//validation logic here
	[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  	], async (req, res) => {
  	//validate for errors
  	let errors = validationResult(req);

  	if(!errors.isEmpty()) {
  		return res.status(422).json({ errors: errors.array() });
  	}

	let hashedPassword = Users.hashPassword(req.body.Password);
	await Users.findOne({ Username: req.body.Username }) //search to see if username is taken
		.then((user) => {
			if (user) { //sends response if user is taken
				return res.status(400).send(req.body.Username + 'already exists');
			} else {
				Users
					.create({
						Username: req.body.Username,
						Password: hashedPassword,
						Email: req.body.Email,
						Birthday: req.body.Birthday
					})
					.then((user) => {res.status(201).json(user) })
				.catch((error) => {
					console.error(error);
					res.status(500).send('Error' + error);
				})
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error' + error);
		});
});

app.post('/users/:Username/FavoriteMovies/:MovieID',  passport.authenticate('jwt', { session: false }), async (req, res) => {
	await Users.findOneAndUpdate({ Username: req.params.Username }, {
		$push: { FavoriteMovies: req.params.MovieID }
	},
	{new: true})
	.then((updatedUser) => {
		res.json(updatedUser);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});


//PUT
//update user info by username, expecting JSON w/ username, password, email, birthday
app.put('/users/:Username',  passport.authenticate('jwt', { session: false }), async (req, res) => {
	if(req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
	await Users.findOneAndUpdate({ Username: req.params.Username }, {$set: 
		{
			Username: req.body.Username,
			Password: req.body.Password,
			Email: req.body.Email,
			Birthday: req.body.Birthday
		}
	},
	{ new: true })
	.then((updatedUser) => {
		res.json(updatedUser);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	})
});

/*app.put('/users/:userID', (req, res) => {
	res.send('User update PUT request successful.')
});*/



//DELETE
app.delete('/users/:Username',  passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//redundant?
/*app.delete('/users/:userID', (req, res) => {
	res.send('User deregister DELETE requst successful.')
});*/

app.delete('/users/:Username/FavoriteMovies/:MovieID',  passport.authenticate('jwt', { session: false }), async (req, res) => {
	await Users.findOneAndUpdate({ Username: req.params.Username }, {
		$pull: {FavoriteMovies: req.params.MovieID}
	},
	{new: true})
	.then((updatedUser) => {
		res.json(updatedUser);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error occurred.');
});


//listens


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
   console.log('Listening on Port ' + port);
});

