const http = require("http");
const fs = require("fs");

const overviewHtml = fs.readFileSync(`${__dirname}/Templates/index.html`);
const overviewCss = fs.readFileSync(`${__dirname}/bootstrap.css`);

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(overviewHtml);
  } else if (req.url === "../bootstrap.css") {
    res.writeHead(200, { "Content-type": "text/css" });
    res.end(overviewCss);
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000");
});

/*
//////////////////////
//TODO
// add link to each book in html
DONE
// create template for book details

// get data from API using URL

// fill in template upon request

// display the right one to the user

*/
