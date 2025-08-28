import { Router } from "express";
import { TelegramController } from "./telegram.controller";
import { container } from "../../composition.root";

export const telegramRouter = Router();

const telegramController = container.get(TelegramController);

telegramRouter.get("/logs", telegramController.getLogs.bind(telegramController));
