import schedule from "node-schedule";
import ScheduleModel from "../../models/schedule";
import { errorHandler } from "../../middleware/errorHandler";
import { ScheduleInterface } from "../../interfaces/schedule";

export const deleteSchedule = async (_req, _res, _next) => {
  try {
    const scheduleObj: ScheduleInterface = await ScheduleModel.findById(
      _req.params.id
    );
    const jobs: any = schedule.scheduledJobs?.[scheduleObj.jobId];
    if (scheduleObj && jobs) {
      console.log("jobs: ", jobs);
      const response: boolean =
        schedule.scheduledJobs[scheduleObj.jobId].cancel();
      console.log("response: ", response);
      // delete job from DB
      await ScheduleModel.deleteOne({ _id: _req.params.id });
    } else {
      return _res.status(404).json({
        message: "schedule not found",
      });
    }
    return _res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    errorHandler(error, _req, _res, _next);
  }
};
