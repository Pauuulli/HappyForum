import dayjs from "dayjs";

export default {
  dateToText(date: Date) {
    const secondDiff = dayjs().diff(date, "s");
    const minDiff = dayjs().diff(date, "m");
    const hourDiff = dayjs().diff(date, "h");
    const dayDiff = dayjs().diff(date, "d");
    if (secondDiff < 60) {
      return "Recently replied";
    } else if (minDiff < 60) {
      return `${minDiff} minutes ago`;
    } else if (hourDiff < 24) {
      return `${hourDiff} hours ago`;
    } else if (dayDiff < 31) {
      return `${dayDiff} days ago`;
    } else {
      return dayjs(date).format("DD/MM/YYYY");
    }
  },
};
