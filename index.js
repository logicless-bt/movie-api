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

let topMovies = [
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

//requests
app.get('/', (req, res) => {
	res.send('Get ready for the top ten queer films!');
});

app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
	res.json(topMovies);
});

app.get('/secreturl', (req, res) => {
  res.send('Consider this an easter egg.');
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

//create server, previous usage
/*http.createServer((request, response) => {
	let addr = request.url,
		q = new URL(addr, 'http://' + request.headers.host),
		filePath = '';


	//appends the url address and timestamp to log.txt
  	fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
	    if (err) {
	      console.log(err);
	    } else {
	      console.log('Added to log.');
	    }
	  });

  	//ensures users visit documentation if they are trying to go there, otherwise sends to index.html
	if (q.pathname.includes('documentation')) {
	    filePath = (__dirname + '/documentation.html');
	  } else {
	    filePath = 'index.html';
	  }

	fs.readFile(filePath, (err, data) => {
		if (err) {
	      throw err;
	    }

	    response.writeHead(200, { 'Content-Type': 'text/html' });
	    response.write(data);
	    response.end();

  });

}).listen(8080);
console.log('My test server is running on Port 8080.');*/