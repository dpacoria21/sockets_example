import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

const messages: [string] = ["Hola!"];

io.on('connection', (socket) => {
    console.log('Esta conectado');

    socket.on('disconnect', () => {
        console.log('desconectado')
    });

    socket.emit('get-messages', messages);

    socket.on('send-message', (payload: string) => {
        messages.push(payload);
        socket.broadcast.emit('get-messages', messages);
        socket.emit('get-messages', messages);
    });

});

// app.get('/', (req, res) => {
//     res.json({
//         ok: true
//     })
// })

server.listen('4000', () => {
    console.log('listen to http://localhost:4000')
})