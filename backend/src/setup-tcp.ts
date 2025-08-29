import split from "split2";
import { LogModel } from "./db/models/Log.model";
import { getSessionMetadata } from "./utils/session-metadata.util";
import { Server } from "net";

export const setupTCP = (tcpServer: Server, redisClient: any) => {

tcpServer.on('connection', socket => {
	socket.pipe(split()).on('data', async line => {
		try {
			const log = JSON.parse(line);
			const ip = log.source?.address || "Unknown";
			const ipPrefix = ip.split('.').slice(0, 3).join('.') || null;
			console.log("Connection from", ip);

			if (ipPrefix !== "10.0.0") {
				let metadata;
				const cachedMetadata = await redisClient.get(ip);
				if (cachedMetadata) {
					metadata = JSON.parse(cachedMetadata);
				} else {
					metadata = getSessionMetadata(log.user_agent?.original || "Unknown", ip);
					await redisClient.set(ip, JSON.stringify(metadata), {
						EX: 3600 * 24 // TTL 1 day
					});
				}
				await LogModel.create({
					originalLog: {...log, formattedTimestamp: new Date(log["@timestamp"])},
					metadata
				});
				const lastLogs = await LogModel.findOne({})
				console.log("Last logs", lastLogs);
			}
		} catch (err: any) {
			console.warn('Parsing error:', err.message);
		}
	});
});
};