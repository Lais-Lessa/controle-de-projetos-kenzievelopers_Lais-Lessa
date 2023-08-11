import "express-async-error";
import express, { Application } from "express";
import "dotenv/config";
import handleMiddlewares from "./middlewares/handle.middlewares";
import router from "./router/routes";

const app: Application = express();
app.use(express.json());
app.use(router);
app.use(handleMiddlewares.error);

export default app;
