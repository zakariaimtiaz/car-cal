"use client";

import React, { useEffect, useState } from "react";
import { daysOfWeek, getMonthDays } from "./helpers";
import CalNavBar from "./components/CalNavBar";

const Schedule = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Get the days for the current month
  const monthDays = getMonthDays(currentYear, currentMonth);
  // Handle next and previous month view

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Car Schedule</h1>

      <CalNavBar
        currentYear={currentYear}
        currentMonth={currentMonth}
        setCurrentYear={setCurrentYear}
        setCurrentMonth={setCurrentMonth}
      />

      <div className="overflow-x-auto">
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
            {[...Array(Math.ceil(monthDays.length / 7))].map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                {monthDays
                  .slice(rowIndex * 7, rowIndex * 7 + 7)
                  .map(({ dateString, month }, colIndex) => {
                    const isCurrentMonth = month === currentMonth;

                    if (!dateString) {
                      return (
                        <td
                          key={colIndex}
                          className="border border-gray-300 h-24"
                        ></td>
                      ); // Empty cell
                    }

                    return (
                      <td
                        key={colIndex}
                        className={`border border-gray-300 h-24 relative px-4 py-2 cursor-pointer ${
                          isCurrentMonth ? "font-bold" : "bg-gray-200"
                        }`}
                      >
                        <span className="absolute top-1 left-1 text-sm">
                          {dateString}
                        </span>
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
