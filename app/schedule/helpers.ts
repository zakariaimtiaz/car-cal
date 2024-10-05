import { format, isSameDay } from "date-fns";
import moment from "moment";

export interface CarSchedule {
  carName: string;
  driverName: string;
  requester: string;
  startDate: Date;
  endDate: Date;
  status: string;
  startTime: string;
  endTime: string;
  color: string;
}

// Helper function to generate the days of the current month
export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getMonthDays = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfNextMonth = new Date(year, month + 1, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let datex = moment(firstDayOfMonth).format("YYYY-MM-DD");

  const daysInMonth = [];
  const totalCells = 35; // Always display 35 cells (7 columns x 5 rows)

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
    const prevMonthDate = new Date(year, month, -i);
    const monthNo = prevMonthDate.getMonth();
    datex = moment(datex).subtract(1, "days").format("YYYY-MM-DD");

    if (i === firstDayOfMonth.getDay() - 1) {
      // Add short month name for the first date
      daysInMonth.unshift({
        dateString: `${prevMonthDate.toLocaleString("default", {
          month: "short",
        })} ${prevMonthDate.getDate()}`,
        month: monthNo,
        fullDate: datex,
      });
    } else {
      // Just add the day number for the rest
      daysInMonth.unshift({
        dateString: prevMonthDate.getDate(),
        month: monthNo,
        fullDate: datex,
      });
    }
  }

  datex = moment(firstDayOfMonth).format("YYYY-MM-DD");

  // Add all days in the current month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const monthNo = firstDayOfMonth.getMonth();
    if (day === 1) {
      daysInMonth.push({
        dateString: `${firstDayOfMonth.toLocaleString("default", {
          month: "short",
        })} ${day}`, // "Sep 1"
        month: monthNo,
        fullDate: datex,
      });
    } else {
      datex = moment(datex).add(1, "days").format("YYYY-MM-DD");

      daysInMonth.push({
        dateString: day,
        month: monthNo,
        fullDate: datex,
      });
    }
  }

  // Fill in the remaining cells for the next month, if needed
  let nextMonthDay = 1;
  while (daysInMonth.length < totalCells) {
    datex = moment(datex).add(1, "days").format("YYYY-MM-DD");

    const monthNo = firstDayOfNextMonth.getMonth();
    if (nextMonthDay === 1) {
      daysInMonth.push({
        dateString: `${firstDayOfNextMonth.toLocaleString("default", {
          month: "short",
        })} ${nextMonthDay}`,
        month: monthNo,
        fullDate: datex,
      });
    } else {
      daysInMonth.push({
        dateString: nextMonthDay,
        month: monthNo,
        fullDate: datex,
      });
    }
    nextMonthDay++;
  }

  return daysInMonth;
};

// Mock API function to fetch car schedule data
export const fetchCarSchedule = async (): Promise<CarSchedule[]> => {
  return [
    {
      carName: "Car A",
      driverName: "John",
      requester: "Helen",
      startDate: new Date(2024, 10, 10),
      endDate: new Date(2024, 10, 11),
      status: "Booked",
      startTime: "09:00",
      endTime: "17:00",
      color: "#1d4ed8",
    },
    {
      carName: "Car B",
      driverName: "Jane",
      requester: "Andrew",
      startDate: new Date(2024, 10, 15),
      endDate: new Date(2024, 10, 15),
      status: "Booked",
      startTime: "08:00",
      endTime: "12:00",
      color: "#f59e0b",
    },
    {
      carName: "Car C",
      driverName: "Roberts",
      requester: "Helen",
      startDate: new Date(2024, 10, 15),
      endDate: new Date(2024, 10, 15),
      status: "Booked",
      startTime: "10:00",
      endTime: "12:00",
      color: "#ef4444",
    },
  ];
};
// Helper function to check if a date is within a booking's range
export const findScheduleForDate = (
  carSchedule: CarSchedule[],
  date: number | Date
) => {
  return carSchedule.filter((schedule) => {
    return date >= schedule.startDate && date <= schedule.endDate;
  });
};

export const getMinTimeOfDay = () => "00:01"; // Define the minimum time of the day
export const getMaxTimeOfDay = () => "23:59"; // Define the maximum time of the day

export const getDisplayTime = (schedule: CarSchedule, date: Date) => {
  const isMultiDay =
    schedule.startDate.getTime() !== schedule.endDate.getTime();
  let displayTime;

  if (isMultiDay) {
    if (isSameDay(date, schedule.startDate)) {
      displayTime = `${schedule.startTime} - ${getMaxTimeOfDay()}`;
    } else if (isSameDay(date, schedule.endDate)) {
      displayTime = `${getMinTimeOfDay()} - ${schedule.endTime}`;
    } else {
      displayTime = `${getMinTimeOfDay()} - ${getMaxTimeOfDay()}`;
    }
  } else {
    displayTime = `${schedule.startTime} - ${schedule.endTime}`;
  }

  return displayTime;
};

export const getTimeAlias = (schedule: CarSchedule, date: Date) => {
  const startTime = schedule.startTime;
  const endTime = schedule.endTime;
  const isMultiDay =
    schedule.startDate.getTime() !== schedule.endDate.getTime();

  if (
    isSameDay(date, schedule.startDate) &&
    isSameDay(date, schedule.endDate)
  ) {
    return `${startTime} - ${endTime}`; // Same day booking
  } else if (isSameDay(date, schedule.startDate)) {
    return `from ${startTime}`; // Starting day
  } else if (isSameDay(date, schedule.endDate)) {
    return `till ${endTime}`; // Ending day
  } else if (isMultiDay) {
    return `whole day`; // Middle days
  } else {
    return ""; // No booking
  }
};
