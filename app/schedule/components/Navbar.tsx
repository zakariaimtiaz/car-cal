import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"; // Import the car icon and sign out icon

// Define the props type for Navbar
interface NavbarProps {
  username: string; // Username should be a string
  onLogout: () => void; // onLogout should be a function with no parameters and no return value
}

const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faCar} // Use the car icon or any other desired icon
          className="text-white text-3xl mr-2" // Adjust size and color as needed
        />
        <h1 className="text-xl font-bold">Car Schedule</h1>
      </div>

      {/* User Section */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="bg-transparent text-white flex items-center focus:outline-none"
        >
          <span className="mr-2">{username}</span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md">
            <ul className="py-2">
              <li
                onClick={onLogout}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center" // Flex for icon alignment
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt} // Logout icon
                  className="mr-2" // Margin for spacing
                />
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
