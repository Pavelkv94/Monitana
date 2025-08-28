import express, { Express } from "express";
import { telegramRouter } from "./features/telegram/telegram.router";
import cors from "cors";
import { viewRouter } from "./features/view/view.router";
import { db } from "./db/db";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса
	app.use(cors());

  app.get("/", (req, res) => {
    res.status(200).send("OK");
  });

	app.use("/tg", telegramRouter);
	app.use("/view", viewRouter);

  app.get("/clear-db", async (req, res) => {
		await db.drop();
    res.status(200).send("DB cleared");
  });
  return app;
};