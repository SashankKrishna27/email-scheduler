import * as express from "express";
import schedule from "./api/scheduler/routes";

const routes = express.Router();

routes.use("/", schedule);

export default routes;
