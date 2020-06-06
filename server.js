const app = require("./index");
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log("application is listining at port " + port);
});
