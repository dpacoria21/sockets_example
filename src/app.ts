import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import prisma from './lib/prisma';
import { CreateMessageBody } from './interfaces/interface';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

app.get('/seed', async (req, res) => {

    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();

    const exampleChat = await prisma.chat.create({
        data: {
            name: 'Chat-Unsa'
        }
    });

    const exampleMessages = ["Saludos tio rolo", "Buenos dias Bombel"];
    exampleMessages.forEach(async (mensaje) => {
        const createdMessage = await prisma.message.create({
            data: {
                message: mensaje,
                chatId: exampleChat.id
            }
        })
        return createdMessage;
    });

    const chats = await prisma.chat.findMany({
        include: {
            Messages: true
        }
    })

    res.json({
        chats
    })

});

app.get('/message', async (req, res) => {
    try {
        const chatUnsa = await prisma.chat.findFirst({
            where: {
                name: 'Chat-Unsa'
            },
            include: {
                Messages: true
            }
        })
        res.json({
            chatUnsa
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            ok: true,
            message: 'No se pudo encontrar el chat correspondiente'
        })
    }
})

app.post('/message', async (req, res) => {

    try {
        const { message, chatName } = req.body as CreateMessageBody;

        if (message.trim().length === 0) {
            return res.status(400).json({
                ok: false,
                message: "No puede insertar mensajes vacios"
            })
        }
        if (chatName.trim().length === 0) {
            return res.status(400).json({
                ok: false,
                message: "No puede encontrar chatName vacio"
            })
        }

        const chat = await prisma.chat.findFirst({
            where: {
                name: chatName
            }
        });

        if (!chat) {
            return res.status(404).json({
                ok: false,
                message: `No puede encontrar el chat con el nombre ${chatName}`
            })
        }

        const newMessage = await prisma.message.create({
            data: {
                message,
                chatId: chat.id
            }
        })


        res.json({
            ok: true,
            newMessage
        });

    } catch (err) {
        console.log(res);
        res.status(500).json({
            ok: false,
            message: "Comuniquese con el administrador"
        })
    }

})

// Sockets
io.on('connection', (socket) => {
    console.log('Esta conectado');

    socket.on('disconnect', () => {
        console.log('desconectado')
    });

    socket.emit('get-messages', "Mensajes nuevos");

    socket.on('send-message', async (payload: { message: string, chat: string }) => {

        const { chat, message } = payload;

        try {
            const data = await (await fetch('http://localhost:4000/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    chatName: chat
                })
            })).json()

            if (!data) {
                throw new Error('No se pudo crear el mensaje');
            }

            socket.broadcast.emit('get-messages', "Mensajes nuevos");
            socket.emit('get-messages', "Mensajes nuevos");
        } catch (err) {
            console.log(err);
        }

    });

});

server.listen('4000', () => {
    console.log('listen to http://localhost:4000')
})