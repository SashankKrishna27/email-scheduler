import ScheduleModel from "../src/models/schedule";
import { scheduleJobAsync } from "./utility/baseUseCase";

export default async () => {
    console.log("Cron scheduler on start is triggered");
    const allActiveSchedules = await ScheduleModel.find({status:"scheduled"});
    console.log("Job ids", allActiveSchedules?.[0]?.jobId);
    allActiveSchedules.forEach(async (element) => {
        await scheduleJobAsync(element);
    })

    console.log("Date: ", new Date(2024, 2, 7, 18, 2));
};
