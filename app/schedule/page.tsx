"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { daysOfWeek, getMonthDays } from "./helpers";
import CalNavBar from "./components/CalNavBar";
import BookingPopup from "./components/BookingPopup";
import ScheduleCard from "./components/ScheduleCard";
import moment from "moment";
import Navbar from "./components/Navbar"; // Import Navbar component

// Define the schedule type
interface Schedule {
  id: string;
  car_name: string;
  schedule_date: string;
  schedule_date_nxt: string;
  start_time: string;
  end_time: string;
  driver_name: string;
  driver_phone: string;
  requestor_id: string;
  requestor_info: string;
  status: string;
}

const Schedule = () => {
  const router = useRouter();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isSaving, setIsSaving] = useState(false); // Spinner for booking save process
  const monthDays = getMonthDays(currentYear, currentMonth);
  const [userInfo, setUserInfo] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    roleCode: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to fetch schedules for the selected month and year
  const fetchSchedule = async (year: number, month: number) => {
    try {
      const response = await fetch(
        `/api/getSchedules?year=${year}&month=${month + 1}`
      );
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      } else {
        console.error("Error fetching schedules:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("USER_INFO");
    if (!userInfo) {
      // If no user info, redirect to login page
      router.push("/login");
    } else {
      setIsLoggedIn(true);
      const user = JSON.parse(userInfo); // Parse the JSON string
      if (user.role_code === "ROLE_MIS_HR_ADMIN") {
        setIsAdmin(true);
      }
      setUserInfo({
        userId: user.employee_id,
        userName: user.employee_name,
        userEmail: user.employee_email,
        roleCode: user.role_code,
      });
      fetchSchedule(currentYear, currentMonth);
    }
  }, [router, currentYear, currentMonth]);

  const handleBook = async (schedule: {
    carId: number;
    startDate: Date;
    endDate: Date;
  }) => {
    setIsSaving(true); // Show spinner during booking save process
    try {
      if (!userInfo) {
        console.error("User info not found in localStorage");
        return;
      }

      const data = {
        car_id: schedule.carId,
        start_time: moment(schedule.startDate).format("YYYY-MM-DD HH:mm:ss"),
        end_time: moment(schedule.endDate).format("YYYY-MM-DD HH:mm:ss"),
        requestor_id: userInfo.userId,
        requestor_info: userInfo.userName + " (" + userInfo.userId + ")",
      };

      const response = await fetch("/api/setSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSelectedDate(null); // Close the popup after booking
      } else {
        console.error("Error saving booking:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSaving(false); // Hide spinner after saving
      fetchSchedule(currentYear, currentMonth);
    }
  };

  const handleDateClick = (fullDate: string) => {
    const clickedDate = new Date(fullDate);
    setSelectedDate(clickedDate);
  };

  // Get all schedules for a specific date
  const getSchedulesForDate = (dateString: string) => {
    const formattedDate = moment(dateString).format("YYYY-MM-DD");

    return schedules.filter((schedule: Schedule) => {
      const startDate = moment(schedule.schedule_date).format("YYYY-MM-DD");
      const endDate = schedule.schedule_date_nxt
        ? moment(schedule.schedule_date_nxt).format("YYYY-MM-DD")
        : startDate; // If schedule_date_nxt is null, treat endDate as startDate

      // Check if the formattedDate matches startDate or endDate
      // Or check if the formattedDate is between startDate and endDate (inclusive)
      return (
        formattedDate === startDate ||
        formattedDate === endDate ||
        (formattedDate > startDate && formattedDate < endDate)
      );
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("USER_INFO"); // Clear user info
    setUserInfo({
      userId: "",
      userName: "",
      userEmail: "",
      roleCode: "",
    }); // Clear user info from state
    setIsLoggedIn(false); // Optional: update logged-in status
    router.push("/login"); // Redirect to login page
  };

  const updateSchedule = async (
    scheduleId: string,
    newStatus: string,
    driverId?: string
  ) => {
    try {
      const data = {
        id: scheduleId,
        status: newStatus,
        driverId: driverId,
      };

      const response = await fetch("/api/updateSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
      } else {
        console.error("Error update booking:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      fetchSchedule(currentYear, currentMonth);
    }
  };

  return (
    <div className="mx-auto">
      {/* Add Navbar at the top */}
      <Navbar username={userInfo.userName} onLogout={handleLogout} />
      {isLoggedIn && (
        <>
          <CalNavBar
            currentYear={currentYear}
            currentMonth={currentMonth}
            setCurrentYear={setCurrentYear}
            setCurrentMonth={setCurrentMonth}
          />

          <div className="overflow-x-auto px-4">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {daysOfWeek.map((day, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 px-4 py-2 text-center"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(Math.ceil(monthDays.length / 7))].map(
                  (_, rowIndex) => (
                    <tr key={rowIndex}>
                      {monthDays
                        .slice(rowIndex * 7, rowIndex * 7 + 7)
                        .map(({ dateString, month, fullDate }, colIndex) => {
                          const isCurrentMonth = month === currentMonth;
                          const carSchedules = getSchedulesForDate(
                            String(fullDate)
                          );
                          if (!dateString) {
                            return (
                              <td
                                key={colIndex}
                                className="border border-gray-300 h-24"
                              ></td>
                            );
                          }

                          return (
                            <td
                              key={colIndex}
                              className={`w-[200px] border border-gray-300 h-24 relative px-3 pt-5 pb-2  ${
                                isCurrentMonth ? "font-bold" : "bg-gray-200"
                              } ${
                                carSchedules.length > 0
                                  ? "bg-green-100 border-green-500"
                                  : "bg-white"
                              }`}
                            >
                              <div className="">
                                <span className="absolute top-1 left-1 text-sm">
                                  {dateString}
                                </span>

                                <span className="absolute top-1 right-1 text-sm">
                                  <FontAwesomeIcon
                                    icon={faPlusCircle}
                                    onClick={() => handleDateClick(fullDate)}
                                    className="mr-2 text-gray-300 cursor-pointer"
                                    title="Click to book car"
                                  />
                                </span>

                                {/* Separate block for each car's schedule */}
                                {carSchedules.length > 0 && (
                                  <div className="text-[.7rem] mt-1">
                                    {carSchedules.map((schedule, index) => (
                                      <ScheduleCard
                                        key={`${schedule.car_name}-${schedule.start_time}-${index}`} // Unique key
                                        schedule={schedule}
                                        fullDate={fullDate}
                                        isAdmin={isAdmin}
                                        onUpdateSchedule={updateSchedule}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {selectedDate && (
            <BookingPopup
              date={selectedDate}
              onClose={() => setSelectedDate(null)}
              onBook={handleBook}
              isSaving={isSaving} // Pass the isSaving prop to show spinner
            />
          )}
        </>
      )}
    </div>
  );
};

export default Schedule;
