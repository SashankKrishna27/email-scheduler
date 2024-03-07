import schedule from "node-schedule";
import { sendEmail } from "../service/emailService";
import { ScheduleInterface } from "../interfaces/schedule";
import ScheduleModel from "../models/schedule";

export const scheduleJobAsync = async (cronData: ScheduleInterface) => {
  return await schedule.scheduleJob(
    cronData?._id?.toString(),
    new Date(cronData?.scheduledTo),
    async () => {
      try {
        console.log("Job is scheduled", cronData?._id);
        if (cronData?.status === "scheduled") {
          const response: Boolean = await sendEmail({
            name: cronData?.name,
            to: cronData?.emailRecepient,
            cc: "",
            subject: cronData?.subject,
            body: cronData?.body,
          });
          if (response) {
            cronData.status = "sent";
            await ScheduleModel.updateOne(
              { _id: cronData?._id },
              { status: "sent" }
            );
          }
          return cronData;
        } else if (cronData?.status === "sent" && cronData?.jobId) {
          schedule.scheduledJobs[cronData?.jobId].cancel();
        }
      } catch (error) {
        throw error;
      }
    }
  );
};
