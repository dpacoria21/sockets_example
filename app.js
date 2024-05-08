const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
    return res.json({
        msg: 'Hola mundo'
    })
})

const messages = ["Saludos a todos"];

io.on('connection', (socket) => {
    // console.log(socket);
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    })

    socket.emit('get-messages', messages);

    socket.on('molestar', (payload) => {
        messages.push(payload);
        io.emit('get-messages', messages);
        console.log(`El servidor se molesto con el siguiente mensaje: ${payload}`)
    })

})

server.listen('4000', () => {
    console.log('listening on http://localhost:4000');
})