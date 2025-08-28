
const net = require('net');
const split = require('split2');

const server = net.createServer();
server.on('connection', socket => {
	socket.pipe(split()).on('data', line => {
		try {
			const log = JSON.parse(line);
			console.log('Получено:', log);
		} catch (err) {
			console.error('Ошибка парсинга:', err.message);
		}
	});
});
server.listen(5006, () => console.log('Слушаю Logstash на порту 5006'));

/*
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const net = require('net');
const split = require('split2');
const Log = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT_HTTP = 3000;
const PORT_TCP = 5055;

// TCP-сервер
net.createServer(socket => {
	socket.pipe(split()).on('data', async line => {
		try {
			const log = JSON.parse(line);
			console.log('📥 Получено:', log);

			await Log.create(log);         // сохраняем в MongoDB
			io.emit('new_log', log);       // отправляем на фронт
		} catch (err) {
			console.error('❌ Ошибка парсинга:', err.message);
		}
	});
}).listen(PORT_TCP, () => {
	console.log(`🚀 TCP-сервер слушает порт ${PORT_TCP}`);
});

// Express + WebSocket
app.get('/', (req, res) => {
	res.send('Лог-сервер работает');
});

server.listen(PORT_HTTP, () => {
	console.log(`🌍 Express + WebSocket на http://localhost:${PORT_HTTP}`);
});

*/