import * as express from "express";
import { getSchedule } from "./getSchedule";
import { createSchedule } from "./createSchedule";
import { deleteSchedule } from "./deleteSchedule";
import { updateSchedule } from "./updateSchedule";
import { getAllSchedules } from "./getAllSchedules";

const router = express.Router();

router.get("/v1/schedule/:id", async (req, res, next) => {
  await getSchedule(req, res, next);
});

router.get("/v1/list-schedules/:status?", async (req, res, next) => {
  await getAllSchedules(req, res, next);
});

router.post("/v1/schedule", async (req, res, next) => {
  await createSchedule(req, res, next);
});

router.put("/v1/schedule/:id", async (req, res, next) => {
    await updateSchedule(req, res, next);
  });

router.delete("/v1/schedule/:id", async (req, res, next) => {
  await deleteSchedule(req, res, next);
});

export default router;
