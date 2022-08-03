import express from 'express';
import morgan from 'morgan';
import { Server  as SocketServer} from 'socket.io';
import http from 'http';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { PORT } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: '*'
    }
});

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log('Socket client connected!!', socket.id);

    socket.on('message', (message) => {
        socket.broadcast.emit('message', message);
    });
});

app.use(express);

app.use(express.static(join(__dirname, '../client/build')));

server.listen(PORT);
console.log(`Server runing on por ${PORT}`);
