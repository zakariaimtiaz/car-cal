import React, { useState } from "react";

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
      <h1 className="text-xl font-bold">Car Schedule</h1>

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
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
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
