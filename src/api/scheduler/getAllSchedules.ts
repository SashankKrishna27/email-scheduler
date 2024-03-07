import ScheduleModel from "../../models/schedule";
import { errorHandler } from "../../middleware/errorHandler";
import { ScheduleInterface } from "../../interfaces/schedule";

export const getAllSchedules = async (_req, _res, _next) => {
  try {
    const status: string = _req?.params?.status;
    let scheduleObj: ScheduleInterface[];
    if (status) {
      scheduleObj = await ScheduleModel.find({ status });
    } else {
      scheduleObj = await ScheduleModel.find();
    }
    if (scheduleObj && scheduleObj?.length) {
      return _res.status(200).json({
        message: "Success",
        data: scheduleObj,
      });
    } else {
      return _res.status(404).json({
        message: "No schedules found",
        data: [],
      });
    }
  } catch (error) {
    errorHandler(error, _req, _res, _next);
  }
};
