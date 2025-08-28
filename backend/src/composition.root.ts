import { Container } from "inversify";
import "reflect-metadata";
import { TelegramController } from "./features/telegram/telegram.controller";
import { TelegramService } from "./features/telegram/telegram.service";

export const container = new Container();


container.bind(TelegramService).to(TelegramService);
container.bind(TelegramController).to(TelegramController);
