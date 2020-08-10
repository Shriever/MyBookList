const http = require("http");
const fs = require("fs");
const fetch = require("node-fetch");
const { resolve } = require("path");
const formatTemplate = require("./modules/format-template");

const overviewHtml = fs.readFileSync(
  `${__dirname}/Templates/index.html`,
  "utf-8"
);
const infoHtml = fs.readFileSync(
  `${__dirname}/Templates/template-info.html`,
  "utf-8"
);
const errorHtml = fs.readFileSync(`${__dirname}/Templates/error.html`, "utf-8");

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/overview" || req.url === "/#") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(overviewHtml);
  } else {
    res.writeHead(200, { "Content-type": "text/html" });

    const url = `https://www.googleapis.com/books/v1/volumes?q=${req.url}`;

    fetch(url)
      .then((re) => re.json())
      .then((data) => data.items[0])
      .then((book) => {
        const output = formatTemplate(infoHtml, book.volumeInfo);

        res.end(output);
        return;
      })
      .catch((err) => {
        res.end(errorHtml);
      });
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000");
});
