const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('./real-time-chat-applicati-fe18f-firebase-adminsdk-ucd7c-686634671b.json'); // replace with your own path to serviceAccountKey.json file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://real-time-chat-applicati-fe18f-default-rtdb.firebaseio.com/' // replace with your own database URL
});

const db = admin.database(); // get a reference to the database
const conversationId = '`${socke.id}`';


io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

const items = [];

app.use(cors());



io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });

    socket.on('message', ({user,message}) => {
        console.log(`User ${socket.id} sent message: ${message}`);
        items.push({ user : user, message : message, timestamp: Date.now() });
        io.emit('message', { user : user, message : message, timestamp: Date.now() });
    });

    socket.on('getItems', () => {
        console.log(`User ${socket.id} requested items`);
        io.to(socket.id).emit('items', items);
    });
});


app.use(bodyParser.json());

const PORT = 5000;
server.listen(PORT, () => {
   console.log(`Server started on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send({ message: 'Welcome to the root endpoint.' });
    console.log(items)
});

app.get('/Team', (req, res) => {
    res.send({ message: 'Welcome to the Team endpoint.' });
});

app.get('/Projects', (req, res) => {
    res.send({ message: 'Welcome to the Projects endpoint.' });
});
