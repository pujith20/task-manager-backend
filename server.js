require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

const server = http.createServer(app);

// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,    
  },
});

require('./sockets/socketHandler')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
