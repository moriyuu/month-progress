import dayjs from "dayjs";
import "dayjs/locale/ja";
import * as holiday_jp from "@holiday-jp/holiday_jp";

interface Holiday extends holiday_jp.Holiday {
  dayjs: dayjs.Dayjs;
}

type Progress = {
  date: number;
  isElapsed: boolean;
  fragment: "░" | "▒";
};

type Day = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SUT";
const DAYS_MAP: { [i: number]: Day } = {
  0: "SUN",
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SUT",
};

export const getMonthProgress = (): {
  progressBar: string;
  percentage: number;
} => {
  const today = dayjs();
  const daysNum = dayjs().daysInMonth();

  //
  // holidays
  //

  const start = new Date().setDate(1);
  const end = new Date().setDate(daysNum);
  const holidays: Holiday[] = holiday_jp
    .between(new Date(start), new Date(end))
    .map((holiday) => ({
      ...holiday,
      dayjs: dayjs(holiday.date),
    }));
  const holidaysMap: {
    [date: number]: Holiday;
  } = holidays.reduce((memo, holiday) => {
    memo[holiday.dayjs.date()] = holiday;
    return memo;
  }, {} as { [date: number]: Holiday });

  //
  // days of this month
  //

  const days: {
    date: number;
    day: Day;
    holiday: string | undefined;
  }[] = Array.from({ length: daysNum }, (_, i) => i + 1).map((date) => {
    const djs = dayjs().date(date);
    return {
      date,
      day: DAYS_MAP[djs.day()],
      holiday: holidaysMap[date]?.name,
    };
  });

  const businessDays = days.filter((day) => {
    if (day.holiday) {
      return false;
    }
    if (day.day === "SUN" || day.day === "SUT") {
      return false;
    }
    return true;
  });

  //
  // month progress
  //

  const progresses: Progress[] = businessDays.map((day) => {
    if (today.date() >= day.date) {
      return {
        date: day.date,
        isElapsed: true,
        fragment: "▒",
      };
    }
    return {
      date: day.date,
      isElapsed: false,
      fragment: "░",
    };
  });

  const progressBar = progresses.map((progress) => progress.fragment).join("");
  const percentage =
    progresses.filter((p) => p.isElapsed).length / progresses.length;
  return {
    progressBar,
    percentage,
  };
};
