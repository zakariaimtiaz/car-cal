import React from "react";

interface CalNavBarProps {
  currentYear: number;
  currentMonth: number;
  setCurrentYear: (year: number) => void;
  setCurrentMonth: (month: number) => void;
}

const CalNavBar: React.FC<CalNavBarProps> = ({
  currentYear,
  currentMonth,
  setCurrentYear,
  setCurrentMonth,
}) => {
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="flex justify-center items-center mb-4 pt-1">
      <button
        onClick={handlePrevMonth}
        className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
      >
        Previous
      </button>

      <span className="w-40 px-4 py-2 rounded mx-2 bg-gray-300 text-gray-700 font-bold text-center cursor-default">
        {new Date(currentYear, currentMonth).toLocaleString("default", {
          month: "long",
        })}{" "}
        {currentYear}
      </span>

      <button
        onClick={handleNextMonth}
        className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
      >
        Next
      </button>
    </div>
  );
};

export default CalNavBar;
