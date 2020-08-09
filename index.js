const http = require("http");

const server = http.createServer((req, res) => {
  res.end("this is the homepage");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000");
});

/*
//////////////////////
//TODO
// add link to each book in html

// create template for book details

// fill in template upon request

// display it to the user

*/
