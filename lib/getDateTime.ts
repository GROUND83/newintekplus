import dayjs from "dayjs";

export default function getDateTime() {
  let time = dayjs().add(9, "hour").toISOString();
  return time;
}
