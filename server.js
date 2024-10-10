//imports
const http = require('http'),
  fs = require('fs'),
  url = require('url');

//create server
http.createServer((request, response) => {
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
console.log('My test server is running on Port 8080.');



//url
//let addr = 'http://localhost:8080/default.html?year=2024&month=october';
//let q = new URL(addr, 'http://localhost:8080');

/*console.log(q.host); //localhost:8080
console.log(q.pathname); //returns path
console.log(q.search); //returns year=2024&month=october

let qdata = q.query; //returns object. {year: 2024, month 'october' }
console.log(qdata);
//console.log(qdata.month); //returns october */

//fs
