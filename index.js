//imports and names modules
const express = require('express');
	morgan = require('morgan');
	fs = require('fs');
	path = require('path');
const app = express();

/*const http = require('http'),
  url = require('url');*/

//setting up morgan and static
app.use(morgan('common'));
app.use(express.static('public'));

//creating the write stream and creating logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

let movies = [
	{
		title:'All of Us Strangers',
		director: 'Andrew Haigh' 
	},
	{
		title: 'Moonlight',
		director: 'Barry Jenkins'
	},
	{
		title: 'Portrait of a Lady on Fire',
		director: 'Celine Sciamma'
	},
	{
		title: 'But I\'m a Cheerleader',
		director: 'Emma Seligman'
	},
	{
		title: 'Everything Everywhere All At Once',
		director: 'Daniel Scheinert'
	},
	{
		title: 'God\' Own Country',
		director: 'Francis Lee'
	},
	{
		title: 'Paris is Burning',
		director: 'Jennie Livingston'
	},
	{
		title: 'Ronnie and I',
		director: 'Guy Shalem'
	},
	{
		title: 'Carol',
		director: 'Todd Haynes'
	},
	{
		title: 'Brokeback Mountain',
		director: 'Ang Lee'
	}
];

//GET
app.get('/', (req, res) => {
	res.send('Get ready for the top queer films!');
});

app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
	res.status(200).json(movies);
});

app.get('/secreturl', (req, res) => {
  res.send('Consider this an easter egg.');
});

app.get('/movies/:title', (req, res) => {
	res.send('Single-movie GET request successful. Description, director, genre, and image returned.')
});

app.get('/movies/genre/:genreName', (req, res) => {
	res.send('Genre GET request successful. Genre returned.')
});

app.get('/movies/director/:directorName', (req, res) => {
	res.send('Director GET request successful. Director bio and relevant filmography returned.')
});

//POST
app.post('/users', (req, res) => {
	res.send('User creation POST request successful.')
    /*const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }*/
});

app.post('/users/:userID/:movieTitle', (req, res) => {
	res.send('Favorite POST request successful.')
});


//PUT
app.put('/users/:userID', (req, res) => {
	res.send('User update PUT request successful.')
});



//DELETE
app.delete('/users/:userID/movies/:movieID', (req, res) => {
	res.send('Favorite removal DELETE request successful.')
});

app.delete('/users/:userID', (req, res) => {
	res.send('User deregister DELETE requst successful.')
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
