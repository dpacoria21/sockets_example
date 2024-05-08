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
        })

    } catch (err) {
        console.log(res);
        res.status(500).json({
            ok: false,
            message: "Comuniquese con el administrador"
        })
    }

})

io.on('connection', (socket) => {
    console.log('Esta conectado');

    socket.on('disconnect', () => {
        console.log('desconectado')
    });

    socket.emit('get-messages', "Mensajes nuevos");

    socket.on('send-message', async (payload: string) => {
        const chatUnsa = await prisma.chat.findFirst({ where: { name: 'Chat-Unsa' } });

        await prisma.message.create({
            data: {
                message: payload,
                chatId: chatUnsa!.id
            }
        });

        // const messages = (await prisma.chat.findFirst({ where: { name: 'Chat-Unsa' }, include: { Messages: true } }))?.Messages;

        socket.broadcast.emit('get-messages', "Mensajes nuevos");
        socket.emit('get-messages', "Mensajes nuevos");
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