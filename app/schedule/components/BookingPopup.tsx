import moment from "moment";
import React, { useState } from "react";

interface BookingPopupProps {
  date: Date;
  onClose: () => void;
  onBook: (schedule: { startDate: Date; endDate: Date }) => void;
  isSaving: boolean; // Track the saving state
}

const BookingPopup: React.FC<BookingPopupProps> = ({
  date,
  onClose,
  onBook,
  isSaving,
}) => {
  // Set default start time to 5 AM
  const defaultStartDate = new Date(date);
  defaultStartDate.setHours(5, 0, 0); // Set to 5:00 AM
  const [startDate, setStartDate] = useState<Date>(defaultStartDate);

  // Set default end time to 5 PM
  const defaultEndDate = new Date(date);
  defaultEndDate.setHours(17, 0, 0); // Set to 5:00 PM
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);

  const [error, setError] = useState<string | null>(null);

  const handleBooking = () => {
    if (startDate >= endDate) {
      setError("End date must be after start date.");
      return;
    }

    setError(null); // Clear any previous error
    onBook({
      startDate: startDate,
      endDate: endDate,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 sm:w-1/3">
        <h2 className="text-2xl font-bold mb-4">Book a Car</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Start date and time */}
        <label htmlFor="startDate" className="block mb-2 text-sm font-medium">
          Start Date and Time:
        </label>
        <input
          type="datetime-local"
          id="startDate"
          className="border rounded w-full p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={moment(startDate).format("YYYY-MM-DDTHH:mm")}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />

        {/* End date and time */}
        <label htmlFor="endDate" className="block mb-2 text-sm font-medium">
          End Date and Time:
        </label>
        <input
          type="datetime-local"
          id="endDate"
          className="border rounded w-full p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={moment(endDate).format("YYYY-MM-DDTHH:mm")}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />

        {/* Booking button with loading state */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleBooking}
            className={`mt-2 py-2 px-4 rounded ${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Booking..." : "Book Car"}
          </button>

          <button
            onClick={onClose}
            className="mt-2 py-2 px-4 rounded bg-gray-300 ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;
