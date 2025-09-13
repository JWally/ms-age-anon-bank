// src/components/Navbar.tsx
import React, { useState } from "react";
import Link from "./Link";

interface NavbarProps {
  username: string;
  onLogout: () => void;
  onAgeVerificationClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  username,
  onLogout,
  onAgeVerificationClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleAgeVerificationClick = () => {
    onAgeVerificationClick();
    closeMenu(); // Close mobile menu if open
  };

  return (
    <>
      <nav className="nav sticky top-0 z-50">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="logo text-2xl text-gray-900 hover:text-blue-600 transition-colors"
              >
                Iron Bank
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/transactions" className="nav-link">
                Transactions
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>

              {/* Age Verification Button */}
              <button
                onClick={handleAgeVerificationClick}
                className="nav-link border border-gray-300 rounded-md mx-2 hover:border-blue-300 hover:bg-blue-50"
                title="Anonymous Identity Verification Service"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
                Age Verification
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                <div className="text-body-sm text-gray-600">
                  <span className="text-gray-500">Welcome, </span>
                  <span className="font-medium text-gray-900">{username}</span>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="btn btn-outline btn-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Mobile hamburger button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-md"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span
                    className={`block h-0.5 w-6 bg-current transform transition-all duration-200 ${
                      isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-200 ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 bg-current transform transition-all duration-200 ${
                      isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
            onClick={closeMenu}
          ></div>
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/dashboard"
                className="block nav-link text-base"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                className="block nav-link text-base"
                onClick={closeMenu}
              >
                Transactions
              </Link>
              <Link
                to="/profile"
                className="block nav-link text-base"
                onClick={closeMenu}
              >
                Profile
              </Link>

              {/* Mobile Age Verification Button */}
              <button
                onClick={handleAgeVerificationClick}
                className="w-full text-left nav-link text-base border border-gray-300 rounded-md hover:border-blue-300 hover:bg-blue-50"
              >
                <svg
                  className="w-4 h-4 inline-block mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
                Age Verification
              </button>

              <div className="border-t border-gray-200 pt-4">
                <div className="px-3 py-2 text-body-sm text-gray-600 mb-3">
                  Signed in as:{" "}
                  <span className="font-medium text-gray-900">{username}</span>
                </div>
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogoutClick();
                  }}
                  className="btn btn-outline w-full"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full mr-3">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-h4 text-gray-900">Confirm Sign Out</h3>
                  <p className="text-body-sm text-gray-600 mt-1">
                    Are you sure you want to sign out of your account?
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <p className="text-body text-gray-600">
                You will need to sign in again to access your Iron Bank account
                and services.
              </p>
            </div>

            <div className="modal-footer">
              <button onClick={cancelLogout} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={confirmLogout} className="btn btn-primary">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
