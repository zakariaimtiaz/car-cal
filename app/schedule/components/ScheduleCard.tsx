import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faUser,
  faUserGear,
  faClock,
  faExclamationCircle,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import moment from "moment";
import { ScheduleStatus } from "../constants";

interface Car {
  car_id: number;
  car_name: string;
}
interface Driver {
  driver_id: number;
  driver_name: string;
}

interface ScheduleCardProps {
  schedule: {
    id: string;
    car_id: string;
    car_name: string;
    start_time: string;
    end_time: string;
    requestor_info: string;
    driver_id: string;
    driver_name: string;
    driver_phone: string;
    status: string;
    requestor_id: string;
  };
  isAdmin: boolean;
  userId: string; // Pass the current user ID
  onUpdateSchedule: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  isAdmin,
  userId,
  onUpdateSchedule,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | undefined>(
    undefined
  );
  const [selectedDriverId, setSelectedDriverId] = useState<string | undefined>(
    undefined
  );
  const [startTime, setStartTime] = useState<string>(schedule.start_time); // State for start time
  const [endTime, setEndTime] = useState<string>(schedule.end_time); // State for end time
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [loadingCars, setLoadingCars] = useState<boolean>(false); // Loading state
  const [loadingDrivers, setLoadingDrivers] = useState<boolean>(false); // Loading state

  const isRequester = userId === schedule.requestor_id;

  const handleCardClick = () => {
    if (isAdmin) {
      fetchAvailableCars();
      fetchAvailableDrivers();
    }
    setModalOpen(true);
  };
  // Fetch available cars
  const fetchAvailableCars = async () => {
    setLoadingCars(true); // Start loading
    try {
      const sDate = moment(schedule.start_time).format("YYYY-MM-DD HH:mm:ss");
      const eDate = moment(schedule.end_time).format("YYYY-MM-DD HH:mm:ss");

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
        setCars(data.rows as Car[]);
      } else {
        throw new Error("Failed to fetch cars");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoadingCars(false); // End loading
    }
  };
  // Function to fetch available drivers
  const fetchAvailableDrivers = async () => {
    setLoadingDrivers(true); // Start loading
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
        setDrivers(data.rows as Driver[]);
      } else {
        throw new Error("Failed to fetch drivers");
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoadingDrivers(false); // End loading
    }
  };

  const closeModal = () => {
    setStartTime(schedule.start_time);
    setEndTime(schedule.end_time);
    setSelectedCarId(undefined);
    setSelectedDriverId(undefined);
    setModalOpen(false);
  };

  const showWarning = (message: string) => {
    setWarningMessage(message);
    // Clear the message after 3 seconds
    setTimeout(() => {
      setWarningMessage(null);
    }, 3000);
  };
  const handleUpdateRequest = async (status: string) => {
    if (status === ScheduleStatus.APPROVED) {
      if (selectedCarId == null || selectedCarId === "") {
        showWarning("Select a car to approve the schedule.");
        return;
      }
      if (selectedDriverId == null || selectedDriverId === "") {
        showWarning("Select a driver to approve the schedule.");
        return;
      }
      setIsApproving(true);
    } else if (status === ScheduleStatus.REJECTED) {
      setIsRejecting(true);
    } else if (status === ScheduleStatus.CANCELED) {
      setIsCanceling(true);
    } else {
      setIsUpdating(true);
    }
    try {
      const data = {
        id: schedule.id,
        startTime: startTime,
        endTime: endTime,
        status: status,
        carId: selectedCarId,
        driverId: selectedDriverId,
      };

      const response = await fetch("/api/updateSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        if (status === ScheduleStatus.APPROVED) {
          setIsApproving(false);
        } else if (status === ScheduleStatus.REJECTED) {
          setIsRejecting(false);
        } else if (status === ScheduleStatus.CANCELED) {
          setIsCanceling(false);
        } else {
          setIsUpdating(false);
        }
      } else {
        console.error("Error update booking:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      onUpdateSchedule();
      closeModal();
    }
  };

  return (
    <div
      className={`mb-1 p-1 border border-gray-300 rounded bg-white w-full relative ${
        (isAdmin || schedule.requestor_id == userId) &&
        schedule.status === ScheduleStatus.REQUESTED
          ? "cursor-pointer"
          : ""
      }`}
      onClick={
        (isAdmin || isRequester) && schedule.status === ScheduleStatus.REQUESTED
          ? handleCardClick
          : undefined
      }
    >
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
        {schedule.status === "Canceled" && (
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="text-red-300 size-4"
            title="Canceled"
          />
        )}
      </div>

      <p>
        <FontAwesomeIcon icon={faClock} className="mr-2" title="Booking time" />
        {moment(schedule.start_time, "YYYY-MM-DD HH:mm:ss").format(
          "hh:mm A"
        )} -{" "}
        {moment(schedule.end_time, "YYYY-MM-DD HH:mm:ss").format("hh:mm A")}
      </p>

      {schedule.car_name && (
        <p className="font-semibold text-blue-600">
          <FontAwesomeIcon icon={faCar} className="mr-2" title="Car Info" />
          {schedule.car_name}
        </p>
      )}
      {schedule.driver_name && (
        <p className="text-green-500">
          <FontAwesomeIcon
            icon={faUserGear}
            className="mr-2"
            title="Driver Info"
          />
          {schedule.driver_name + " (" + schedule.driver_phone + ")"}
        </p>
      )}

      <p className="text-blue-300">
        <FontAwesomeIcon
          icon={faUser}
          className="mr-2"
          title="Requestor Info"
        />
        {schedule.requestor_info}
      </p>

      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-4 w-[30%]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Conditional rendering for warning message */}
            {warningMessage && (
              <div className="bg-yellow-200 text-yellow-800 p-4 mb-4 rounded">
                {warningMessage}
              </div>
            )}
            <h2 className="font-semibold text-lg">Update Schedule</h2>

            {/* Inputs for Requester to update time */}
            {isRequester && (
              <>
                <div className="mt-4">
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    value={moment(startTime).format("YYYY-MM-DDTHH:mm")}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 mt-2 border rounded"
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="endTime">End Time</label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    value={moment(endTime).format("YYYY-MM-DDTHH:mm")}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 mt-2 border rounded"
                  />
                </div>
              </>
            )}
            {/* Car selection dropdown, initially hidden */}
            {isAdmin && (
              <>
                <label htmlFor="carSelect" className="block mb-2"></label>
                <select
                  id="carSelect"
                  className="border rounded w-full p-2 mb-4"
                  value={selectedCarId || ""}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  disabled={loadingCars} // Disable select if loading
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
                {loadingCars && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin"
                    />
                  </div>
                )}
              </>
            )}
            {/* Dropdown for Driver Selection */}
            {isAdmin && (
              <>
                <div className="mt-4">
                  <select
                    id="driver"
                    value={selectedDriverId || ""}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    disabled={loadingDrivers} // Disable select if loading
                  >
                    <option value="">Select a driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.driver_id} value={driver.driver_id}>
                        {driver.driver_name}
                      </option>
                    ))}
                  </select>
                  {loadingDrivers && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-end mt-4">
              {isRequester && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleUpdateRequest(ScheduleStatus.REQUESTED)}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              )}

              {isRequester && !isAdmin && (
                <>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleUpdateRequest(ScheduleStatus.CANCELED)}
                  >
                    {isCanceling ? "Canceling..." : "Cancel"}
                  </button>
                </>
              )}

              {isAdmin && (
                <>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => handleUpdateRequest(ScheduleStatus.APPROVED)}
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleUpdateRequest(ScheduleStatus.REJECTED)}
                  >
                    {isRejecting ? "Rejecting..." : "Reject"}
                  </button>
                </>
              )}
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
