import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const nowIST = () => dayjs().tz("Asia/Kolkata");

export const toIST = (utcTime) => dayjs.utc(utcTime).tz("Asia/Kolkata");

export const localToISTUtcISOString = (localTimeStr) => {
  return dayjs(localTimeStr).tz("Asia/Kolkata").utc().format();
};