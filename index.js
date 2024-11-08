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

//setting up Mongo
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true }); //should be cdDB?

//setting up morgan and static
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//creating the write stream and creating logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

let movies = [
	{
		title:'All of Us Strangers',
		//"A lonely screenwriter develops an intimate relationship with his mysterious neighbour while his past returns to life."
		director: 'Andrew Haigh',
		//"Andrew Haigh is an English filmmaker who was born in Harrogate and studied at Newcastle University."
		genre: "fantasy"
		//"Fantasy is a genre of speculative fiction which involves themes of the supernatural, magic, and imaginary worlds and creatures."
	},
	{
		title: 'Moonlight',
		//"The film presents three stages in the life of the main character: his childhood, adolescence, and early adult life. It explores the difficulties he faces with his homosexuality and identity as a black homosexual man, including the physical and emotional abuse he endures growing up."
		director: 'Barry Jenkins',
		//"Barry Jenkins is an American filmmaker whose work captures the essence of his tumultuous life."
		genre: 'drama'
		//"Drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
	},
	{
		title: 'Portrait of a Lady on Fire',
		//"Set in France in the late 18th century, the film tells the story of a lesbian affair between two young women: an aristocrat and a painter commissioned to paint her portrait."
		director: 'Celine Sciamma',
		//"Céline Sciamma is a French screenwriter and film director whose films capture the female gaze, fluidity of gender, and sexual identity."
		genre: 'historical'
		//"Historical fiction is a genre in which a fictional plot takes place in the setting of particular real historical events, paying attention to the manners, social conditions, and details of the period."
	},
	{
		title: 'But I\'m a Cheerleader',
		//"A high school cheerleader's parents send her to a residential in-patient conversion therapy camp to ""cure"" her lesbianism, which fails dramatically."
		director: 'Emma Seligman',
		//"Emma Seligman is a Canadian film director and screenwriter whose films focus on female relationships with sex."
		genre: 'comedy'
		//"Comedy is a genre that consists of discourses or works intended to be humorous or amusing by inducing laughter, and may include elements of satire, dramatic irony, or taboo humor."
	},
	{
		title: 'Everything Everywhere All At Once',
		//"A Chinese-American immigrant, while audited by the IRS, discovers that she must connect with parallel universe versions of herself to prevent a powerful being from destroying the multiverse."
		director: 'Daniel Kwan',
		//"Daniel Kwan is one half of an American filmmaking duo with Daniel Scheinert, whose careers started by making music videos."
		genre: 'fantasy'
		//"Fantasy is a genre of speculative fiction which involves themes of the supernatural, magic, and imaginary worlds and creatures."
	},
	{
		title: 'God\'s Own Country',
		//"A young sheep farmer in Yorkshire has his life transformed by a Romanian migrant worker."
		director: 'Francis Lee',
		//"Francis Lee is an English filmmaker who never formally studied the subject, and who writes the films he directs."
		genre: 'drama'
		//"Drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
	},
	/*{
		title: 'Paris is Burning',
		director: 'Jennie Livingston'
	},*/
	/*{
		title: 'Ronnie and I',
		director: 'Guy Shalem'
	},*/
	{
		title: 'Carol',
		//"Set in 1950s New York City, the story is about a forbidden affair between an aspiring female photographer and an older woman going through a difficult divorce."
		director: 'Todd Haynes',
		//"Todd Haynes is an American film director, screenwriter, and producer. His films span four decades with themes examining the personalities of well-known musicians, dysfunctional and dystopian societies, and blurred gender roles."
		genre: 'historical'
		//"Historical fiction is a genre in which a fictional plot takes place in the setting of particular real historical events, paying attention to the manners, social conditions, and details of the period."
	},
	/*{
		title: 'Brokeback Mountain',
		director: 'Ang Lee'
	},*/
	{
		title: 'Weekend',
		//"Two men begin a relationship the weekend before one of them plans to leave the country."
		director: 'Andrew Haigh',
		//"Andrew Haigh  is an English filmmaker who was born in Harrogate and studied at Newcastle University."
		genre: 'drama'
		//"Drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
	},
	{
		title: 'Ammonite',
		//"The film follows a speculative romance between 1840s paleontologist Mary Anning and geologist Charlotte Murchison."
		director: 'Francis Lee',
		//"Francis Lee is an English filmmaker who never formally studied the subject, and who writes the films he directs."
		genre: 'historical'
		//"Historical fiction is a genre in which a fictional plot takes place in the setting of particular real historical events, paying attention to the manners, social conditions, and details of the period."
	},
	{
		title: 'Shiva Baby',
		//"A young bisexual Jewish woman attends a shiva with her parents alongside two of her exes."
		director: 'Emma Seligman',
		//"Emma Seligman is a Canadian film director and screenwriter whose films focus on female relationships with sex."
		genre: 'comedy'
		//"Comedy is a genre that consists of discourses or works intended to be humorous or amusing by inducing laughter, and may include elements of satire, dramatic irony, or taboo humor."
	}
];

//GET
app.get('/', (req, res) => {
	res.send('Get ready for the top queer films!');
});

app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', async (req, res) => {
	await Movies.find()
		.then((movies) => {
			res.status(201).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

app.get('/secreturl', async (req, res) => {
  res.send('Consider this an easter egg.');
});

app.get('/movies/:Title', async (req, res) => {
	await Movies.findOne({ Title: req.params.Title })
		.then((movies) => {
			res.status(201).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

app.get('/movies/genre/:genre', async (req, res) => {
	await Movies.find({ 'Genre.Name': req.params.genre })
	.then((movies) => {
		res.status(201).json(movies);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

app.get('/movies/director/:director', async (req, res) => {
	await Movies.find({ 'Director.Name': req.params.director })
	.then((movies) => {
		res.status(201).json(movies);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

app.get('/users', async (req, res) => {
	await Users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

app.get('/users/:Username', async (req, res) => {
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
app.post('/users', async (req, res) => {
	await Users.findOne({ Username: req.body.Username })
		.then((user) => {
			if (user) {
				return res.status(400).send(req.body.Username + 'already exists');
			} else {
				Users
					.create({
						Username: req.body.Username,
						Password: req.body.Password,
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

app.post('/users/:Username/FavoriteMovies/:MovieID', async (req, res) => {
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
app.put('/users/:Username', async (req, res) => {
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
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
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

app.delete('/users/:Username/FavoriteMovies/:MovieID', async (req, res) => {
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
app.listen(8080, () => {
	console.log('Listening on port 8080');
});
