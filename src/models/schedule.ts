import { Schema, model } from "mongoose";

const scheduleSchema = new Schema({
  emailRecepient: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  scheduledTo: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  emailType: {
    type: String,
    required: true,
  },
  jobId: {
    type: String,
  },
});

const ScheduleModel = model("schedule", scheduleSchema);

export default ScheduleModel;
