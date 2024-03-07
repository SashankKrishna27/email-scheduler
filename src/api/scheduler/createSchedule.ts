import ScheduleModel from "../../models/schedule";
import { errorHandler } from "../../middleware/errorHandler";
import { scheduleJobAsync } from "../../utility/baseUseCase";
import { ScheduleInterface } from "../../interfaces/schedule";

export const createSchedule = async (_req, _res, _next) => {
  try {
    const payload: ScheduleInterface = _req.body;
    const data = await ScheduleModel.create(payload);
    const emailResponse = await scheduleJobAsync(data);
    if (emailResponse) {
      data.jobId = emailResponse?.name;
    } else {
      data.status = "failed";
      await data.save();
      return _res.status(500).json({
        message: "Something went wrong",
      });
    }
    await data.save();
    console.log(emailResponse);
    console.log("data: ", data);
    return _res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    errorHandler(error, _req, _res, _next);
  }
};
