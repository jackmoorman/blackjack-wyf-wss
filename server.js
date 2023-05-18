const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

server.listen(3100, () => console.log(`Server running on port 3100`))