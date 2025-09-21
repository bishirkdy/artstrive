import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Current IST time
export const nowIST = () => dayjs().tz("Asia/Kolkata");

// Convert UTC timestamp to IST
export const toIST = (utcTime) => dayjs.utc(utcTime).tz("Asia/Kolkata");
