import React from "react";

interface BookingPopupProps {
  date: Date;
  onClose: () => void;
  onBook: (date: Date) => void; // Specify the type for onBook
}

const BookingPopup: React.FC<BookingPopupProps> = ({
  date,
  onClose,
  onBook,
}) => {
  const handleBooking = () => {
    onBook(date);
    onClose(); // Close the popup after booking
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Book a Car</h2>
        <p>Select a car for {date.toLocaleDateString()}:</p>
        <button
          onClick={handleBooking}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Book Car
        </button>
        <button
          onClick={onClose}
          className="mt-2 bg-gray-300 py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BookingPopup;
