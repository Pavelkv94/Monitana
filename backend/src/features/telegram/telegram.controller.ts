import { injectable } from "inversify";
import { TelegramService } from "./telegram.service";
import { Request, Response } from "express";

@injectable()
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) { }

	async getLogs(req: Request<{}, {}, {}, { period: string }>, res: Response) {
		const period = req.query.period;
		const logs = await this.telegramService.getLogs(period);
		res.status(200).json(logs);
	}
}