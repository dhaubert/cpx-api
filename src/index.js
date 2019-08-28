const server = require('./server');

console.log("Server listening on port 3005");

server.listen(process.env.PORT || 3005);
