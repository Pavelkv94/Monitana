import express from "express";
import { setupApp } from "./setup-app";
import http from "http";
import { config } from "dotenv";
import { db } from "./db/db";
import { createClient } from 'redis';
import { setupTCP } from "./setup-tcp";

config();

const redisClient = createClient({
	url: process.env.REDIS_URL as string,
});
redisClient.connect().then(() => console.log('Redis connected')).catch(console.error);

const app = express();
const tcpServer = http.createServer(app);



db.connect(process.env.MONGO_URL as string);

setupApp(app);
setupTCP(tcpServer, redisClient);

// запуск tcp сервера
tcpServer.listen(process.env.PORT_TCP, () => console.log('Listening Logstash on port 5006'));

// запуск приложения
app.listen(process.env.PORT_HTTP, () => {
	console.log(`Example app listening on port ${process.env.PORT_HTTP}`);
});






