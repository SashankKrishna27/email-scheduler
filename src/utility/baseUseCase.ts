import schedule from "node-schedule";
import { sendEmail } from "../service/emailService";
import { ScheduleInterface } from "../interfaces/schedule";

export const scheduleJobAsync = async (cronData: ScheduleInterface) => {
  return await schedule.scheduleJob(
    cronData?._id?.toString(),
    cronData?.cronExpression,
    async () => {
      try {
        console.log("Job is scheduled");
        const response: Boolean = await sendEmail({
          name: cronData?.name,
          to: cronData?.emailRecepient,
          cc: "",
          subject: cronData?.subject,
          body: cronData?.body,
        });
        if (response) {
          cronData.status = "sent";
        }
        return cronData;
      } catch (error) {
        throw error;
      }
    }
  );
};