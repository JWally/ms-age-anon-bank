// src/components/AuthModal.tsx
import React, { useState, useEffect, useRef } from "react";

interface AuthModalProps {
  onLoginSuccess: (username: string) => void;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Auto-focus the username input when modal mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (usernameRef.current) {
        usernameRef.current.focus();
      }
    }, 100); // Small delay to ensure modal is fully rendered

    return () => clearTimeout(timer);
  }, []);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent scroll events from propagating to background
  const handleModalScroll = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Demo: Accept any credentials
      onLoginSuccess(formData.username);
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="modal"
        onWheel={handleModalScroll}
        onTouchMove={handleModalScroll}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-h3 text-gray-900">Sign In</h2>
              <p className="text-body-sm text-gray-600 mt-1">
                Access your Iron Bank account
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                ref={usernameRef}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your username"
                autoComplete="username"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <svg
                className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Demo Environment
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  This is a demonstration. Any username and password combination
                  will grant access.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer bg-gray-50">
          <p className="text-caption text-gray-500 text-center w-full">
            Secured with enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
