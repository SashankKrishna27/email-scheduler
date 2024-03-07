import schedule from "node-schedule";
import ScheduleModel from "../../models/schedule";
import { errorHandler } from "../../middleware/errorHandler";
import { scheduleJobAsync } from "../../utility/baseUseCase";
import { ScheduleInterface } from "../../interfaces/schedule";

export const updateSchedule = async (_req, _res, _next) => {
  try {
    const data: ScheduleInterface = _req.body;
    const scheduleObj = await ScheduleModel.findByIdAndUpdate(
      {
        _id: _req.params.id,
      },
      { ...data },
      { new: true }
    );
    const jobs = schedule.scheduledJobs[scheduleObj?.jobId];
    if (scheduleObj && jobs) {
      console.log("jobs: ", jobs);
      const response: boolean =
        schedule.scheduledJobs[scheduleObj?.jobId]?.cancel();
      console.log("response: ", response);
      if (response) {
        const emailResponse: ScheduleInterface = await scheduleJobAsync(
          scheduleObj
        );
        if (emailResponse) {
          scheduleObj.jobId = emailResponse?.name;
          scheduleObj.status = "sent";
        } else {
          scheduleObj.status = "failed";
          await scheduleObj.save();
          return _res.status(500).json({
            message: "Something went wrong",
          });
        }
        await scheduleObj.save();
      }
    } else {
      scheduleObj.status = "failed";
      await scheduleObj.save();
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
