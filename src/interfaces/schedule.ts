export interface ScheduleInterface {
  _id: any;
  emailRecepient: string;
  name: string;
  createdAt: Date;
  subject: string;
  body: string;
  scheduledTo: Date;
  status: string;
  emailType: string;
  jobId?: string;
}
