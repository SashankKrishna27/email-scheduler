import ScheduleModel from "../../models/schedule";
import { errorHandler } from "../../middleware/errorHandler";
import { ScheduleInterface } from "../../interfaces/schedule";

export const getSchedule = async (_req, _res, _next) => {
  try {
    const scheduleObj: ScheduleInterface = await ScheduleModel.findById(
      _req.params.id
    );
    if (scheduleObj) {
      return _res.status(200).json({
        message: "Success",
        data: scheduleObj,
      });
    } else {
      return _res.status(404).json({
        message: "schedule not found",
      });
    }
  } catch (error) {
    errorHandler(error, _req, _res, _next);
  }
};
