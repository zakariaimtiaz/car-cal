import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faUser,
  faClock,
  faExclamationCircle,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import moment from "moment";

interface ScheduleCardProps {
  schedule: {
    id: string;
    car_name: string;
    start_time: string;
    end_time: string;
    requestor_info: string;
    driver_name: string;
    driver_phone: string;
    status: string;
  };
  fullDate: string;
  isAdmin: boolean;
  onUpdateSchedule: (
    scheduleId: string,
    newStatus: string,
    driverId?: string
  ) => void; // Update prop to include driver ID
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  fullDate,
  isAdmin,
  onUpdateSchedule,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]); // Update type as per your driver structure
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null); // State for selected driver

  const handleCardClick = () => {
    if (isAdmin) {
      fetchAvailableDrivers();
      setModalOpen(true);
    }
  };

  // Function to fetch available drivers
  const fetchAvailableDrivers = async () => {
    try {
      const sDate = moment(schedule.start_time).format("YYYY-MM-DD HH:mm:ss");
      const eDate = moment(schedule.end_time).format("YYYY-MM-DD HH:mm:ss");

      const response = await fetch(
        `/api/getAvailableDrivers?startDate=${encodeURIComponent(
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
        setDrivers(data.rows);
      } else {
        throw new Error("Failed to fetch cars");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const closeModal = () => {
    setSelectedDriverId("");
    setModalOpen(false);
  };

  const handleApprove = () => {
    if (selectedDriverId == null || selectedDriverId == "") {
      alert("Assign a driver.");
    }
    if (selectedDriverId) {
      onUpdateSchedule(schedule.id, "Approved", selectedDriverId);
      closeModal();
    }
  };

  const handleReject = () => {
    onUpdateSchedule(schedule.id, "Rejected");
    closeModal();
  };

  return (
    <div
      className={`mb-1 p-1 border border-gray-300 rounded bg-white w-full relative ${
        isAdmin && schedule.status === "Requested" ? "cursor-pointer" : ""
      }`}
      onClick={
        isAdmin && schedule.status === "Requested" ? handleCardClick : undefined
      }
    >
      {/* Status Icon with Tooltip */}
      <div className="absolute top-2 right-2">
        {schedule.status === "Requested" && (
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className="text-yellow-400 size-4"
            title="Requested"
          />
        )}
        {schedule.status === "Approved" && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-500 size-4"
            title="Approved"
          />
        )}
        {schedule.status === "Rejected" && (
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="text-red-500 size-4"
            title="Rejected"
          />
        )}
      </div>

      {/* Car Icon before Car Name */}
      <p className="font-semibold text-blue-600">
        <FontAwesomeIcon icon={faCar} className="mr-2" title="Car Info" />
        {schedule.car_name}
      </p>

      {/* Clock Icon before Time */}
      <p>
        <FontAwesomeIcon icon={faClock} className="mr-2" title="Booking time" />
        {moment(schedule.start_time).isSame(fullDate, "day") &&
        moment(schedule.end_time).isSame(fullDate, "day") ? (
          <>
            {moment(schedule.start_time, "YYYY-MM-DD HH:mm:ss").format(
              "hh:mm A"
            )}{" "}
            -{" "}
            {moment(schedule.end_time, "YYYY-MM-DD HH:mm:ss").format("hh:mm A")}
          </>
        ) : moment(schedule.start_time).isSame(fullDate, "day") &&
          moment(schedule.end_time).isAfter(fullDate, "day") ? (
          <>
            {moment(schedule.start_time, "YYYY-MM-DD HH:mm:ss").format(
              "hh:mm A"
            )}{" "}
            - 11:59 PM
          </>
        ) : moment(schedule.start_time).isBefore(fullDate, "day") &&
          moment(schedule.end_time).isSame(fullDate, "day") ? (
          <>
            12:00 AM -{" "}
            {moment(schedule.end_time, "YYYY-MM-DD HH:mm:ss").format("hh:mm A")}
          </>
        ) : moment(schedule.start_time).isBefore(fullDate, "day") &&
          moment(schedule.end_time).isAfter(fullDate, "day") ? (
          <>12:00 AM - 11:59 PM</>
        ) : null}
      </p>

      {/* Driver Icon before Driver Name */}
      {schedule.driver_name && (
        <p className="text-green-500">
          <FontAwesomeIcon icon={faCar} className="mr-2" title="Driver Info" />
          {schedule.driver_name + " (" + schedule.driver_phone + ")"}
        </p>
      )}

      {/* User Icon before User Name */}
      <p className="text-blue-300">
        <FontAwesomeIcon
          icon={faUser}
          className="mr-2"
          title="Requestor Info"
        />
        {schedule.requestor_info}
      </p>

      {/* Modal for Admin Actions */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={closeModal} // Close modal on background click
        >
          <div
            className="bg-white rounded-lg p-4"
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up to background
          >
            <h2 className="font-semibold text-lg">Schedule Details</h2>
            <p>
              <strong>Car:</strong> {schedule.car_name}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {moment(schedule.start_time).format("hh:mm A")} -{" "}
              {moment(schedule.end_time).format("hh:mm A")}
            </p>
            <p>
              <strong>Requestor:</strong> {schedule.requestor_info}
            </p>

            {/* Dropdown for Driver Selection */}
            <div className="mt-4">
              <select
                id="driver"
                value={selectedDriverId || ""}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              >
                <option value="">Select a driver</option>
                {drivers.map((driver) => (
                  <option key={driver.driver_id} value={driver.driver_id}>
                    {driver.driver_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleReject}
              >
                Reject
              </button>
              <button className="ml-2 text-gray-500" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;
