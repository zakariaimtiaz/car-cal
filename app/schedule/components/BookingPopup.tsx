import moment from "moment";
import React, { useState } from "react";

interface BookingPopupProps {
  date: Date;
  onClose: () => void;
  onBook: (schedule: { carId: number; startDate: Date; endDate: Date }) => void;
  isSaving: boolean; // Add this prop to track the saving state
}

const BookingPopup: React.FC<BookingPopupProps> = ({
  date,
  onClose,
  onBook,
  isSaving, // Receive saving state prop
}) => {
  const [cars, setCars] = useState<{ car_id: number; car_name: string }[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Set default start time to 5 AM
  const defaultStartDate = new Date(date);
  defaultStartDate.setHours(5, 0, 0); // Set to 5:00 AM
  const [startDate, setStartDate] = useState<Date>(defaultStartDate);

  // Set default end time to 5 PM
  const defaultEndDate = new Date(date);
  defaultEndDate.setHours(17, 0, 0); // Set to 5:00 PM
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);

  const [error, setError] = useState<string | null>(null);

  // Fetch available cars
  const fetchCars = async () => {
    try {
      setShowCarDropdown(false);
      setIsSearching(true);

      const sDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
      const eDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");

      const response = await fetch(
        `/api/getAvailableCars?startDate=${encodeURIComponent(
          sDate
        )}&endDate=${encodeURIComponent(eDate)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCars(data.rows);
        setShowCarDropdown(true);
        setIsSearching(false);
      } else {
        throw new Error("Failed to fetch cars");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setError("Could not fetch available cars.");
    }
  };

  const handleBooking = () => {
    if (!selectedCarId) {
      alert("Please select a car.");
      return;
    }

    if (startDate >= endDate) {
      alert("End date must be after start date.");
      return;
    }

    onBook({
      carId: selectedCarId,
      startDate: startDate,
      endDate: endDate,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Book a Car</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Start date and time */}
        <label htmlFor="startDate" className="block mb-2">
          Start Date and Time:
        </label>
        <input
          type="datetime-local"
          id="startDate"
          className="border rounded w-full p-2 mb-4"
          value={moment(startDate).format("YYYY-MM-DDTHH:mm")}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />

        {/* End date and time */}
        <label htmlFor="endDate" className="block mb-2">
          End Date and Time:
        </label>
        <input
          type="datetime-local"
          id="endDate"
          className="border rounded w-full p-2 mb-4"
          value={moment(endDate).format("YYYY-MM-DDTHH:mm")}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />

        {/* Button to search available cars */}
        <button
          onClick={fetchCars}
          className="mt-4 mb-4 bg-blue-400 text-white py-2 px-4 rounded w-full"
          disabled={isSearching}
        >
          {isSearching
            ? "Searching .... ... .. . . . "
            : "Search Available Cars"}
        </button>

        {/* Car selection dropdown, initially hidden */}
        {showCarDropdown && (
          <>
            <label htmlFor="carSelect" className="block mb-2"></label>
            <select
              id="carSelect"
              className="border rounded w-full p-2 mb-4"
              value={selectedCarId || ""}
              onChange={(e) => setSelectedCarId(Number(e.target.value))}
            >
              <option value="" disabled>
                Select a car
              </option>
              {cars.map((car) => (
                <option key={car.car_id} value={car.car_id}>
                  {car.car_name}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Booking button with loading state */}
        {showCarDropdown && (
          <button
            onClick={handleBooking}
            className={`mt-4 py-2 px-4 rounded w-full ${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Booking..." : "Book Car"}
          </button>
        )}
        <button
          onClick={onClose}
          className="mt-2 bg-gray-300 py-2 px-4 rounded block w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BookingPopup;
