import React, { useState, useEffect, useRef } from "react";

interface AuthModalProps {
  onLoginSuccess: (username: string) => void;
  onClose: () => void;
}

// Move FormContent outside to prevent recreation on every render
interface FormContentProps {
  formData: { username: string; password: string };
  error: string;
  isLoading: boolean;
  isMobile: boolean;
  usernameRef: React.RefObject<HTMLInputElement>;
  mobileUsernameRef: React.RefObject<HTMLInputElement>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const FormContent: React.FC<FormContentProps> = ({
  formData,
  error,
  isLoading,
  isMobile,
  usernameRef,
  mobileUsernameRef,
  onInputChange,
  onKeyDown,
  onSubmit,
}) => (
  <div className={isMobile ? "space-y-4" : "space-y-6"}>
    <div>
      <label
        className={`block ${isMobile ? "text-sm" : "text-sm"} font-medium text-gray-700 mb-1.5`}
      >
        Username
      </label>
      <input
        ref={isMobile ? mobileUsernameRef : usernameRef}
        type="text"
        name="username"
        value={formData.username}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        className={`w-full ${isMobile ? "px-3 py-2 text-sm" : "px-3 py-2 text-sm"} text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        placeholder="Enter your username"
        autoComplete="username"
        disabled={isLoading}
        style={{ minHeight: isMobile ? "38px" : "44px" }}
      />
    </div>

    <div>
      <label
        className={`block ${isMobile ? "text-sm" : "text-sm"} font-medium text-gray-700 mb-1.5`}
      >
        Password
      </label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        className={`w-full ${isMobile ? "px-3 py-2 text-sm" : "px-3 py-2 text-sm"} text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        placeholder="Enter your password"
        autoComplete="current-password"
        disabled={isLoading}
        style={{ minHeight: isMobile ? "38px" : "44px" }}
      />
    </div>

    {error && (
      <div className="bg-red-50 border border-red-200 rounded-md p-2.5">
        <p className={`text-red-600 ${isMobile ? "text-xs" : "text-sm"}`}>
          {error}
        </p>
      </div>
    )}

    <button
      onClick={onSubmit}
      disabled={isLoading}
      className={`w-full ${isMobile ? "py-2.5 px-3 text-sm" : "py-3 px-4 text-sm"} bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      style={{ minHeight: isMobile ? "40px" : "auto" }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Signing In...
        </div>
      ) : (
        "Sign In"
      )}
    </button>
  </div>
);

// Move DemoNotice outside as well
interface DemoNoticeProps {
  isMobile: boolean;
}

const DemoNotice: React.FC<DemoNoticeProps> = ({ isMobile }) => (
  <div
    className={`bg-blue-50 border border-blue-200 rounded-md ${isMobile ? "p-3" : "p-4"} ${isMobile ? "mt-4" : "mt-6"}`}
  >
    <div className="flex">
      <svg
        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-blue-400 mt-0.5 mr-2.5 flex-shrink-0`}
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
        <h3
          className={`${isMobile ? "text-xs" : "text-sm"} font-medium text-blue-800`}
        >
          Demo Environment
        </h3>
        <p
          className={`${isMobile ? "text-xs" : "text-sm"} text-blue-700 mt-0.5`}
        >
          This is a demonstration. Any username and password combination will
          grant access.
        </p>
      </div>
    </div>
  </div>
);

const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const mobileUsernameRef = useRef<HTMLInputElement>(null);

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
      if (mobileUsernameRef.current) {
        mobileUsernameRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle backdrop click to close modal (desktop only)
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
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
    <>
      {/* Mobile: Fullscreen Modal */}
      <div className="fixed inset-0 z-50 sm:hidden bg-gray-50 flex flex-col">
        {/* Mobile Header - Sticky */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sign In</h2>
              <p className="text-xs text-gray-600">
                Access your Iron Bank account
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
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

        {/* Mobile Body - Scrollable */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          onWheel={handleModalScroll}
          onTouchMove={handleModalScroll}
        >
          <FormContent
            formData={formData}
            error={error}
            isLoading={isLoading}
            isMobile={true}
            usernameRef={usernameRef}
            mobileUsernameRef={mobileUsernameRef}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmit}
          />
          <DemoNotice isMobile={true} />

          {/* Additional mobile options */}
          <div className="mt-6 space-y-3">
            <button className="w-full text-center text-sm text-blue-600 font-medium py-2">
              Forgot Password?
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gray-50 text-gray-500">OR</span>
              </div>
            </div>
            <button className="w-full text-center text-sm text-gray-600 py-2">
              Create New Account
            </button>
          </div>
        </div>

        {/* Mobile Footer - Sticky */}
        <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-4 py-3">
          <p className="text-[10px] text-gray-500 text-center">
            Secured with enterprise-grade encryption
          </p>
        </div>
      </div>

      {/* Desktop: Centered Modal */}
      <div
        className="hidden sm:flex fixed inset-0 items-center justify-center z-50 p-4 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{ backdropFilter: "blur(4px)" }}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full"
          onWheel={handleModalScroll}
          onTouchMove={handleModalScroll}
        >
          {/* Desktop Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
                <p className="text-sm text-gray-600 mt-1">
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

          {/* Desktop Body */}
          <div className="px-6 py-6">
            <FormContent
              formData={formData}
              error={error}
              isLoading={isLoading}
              isMobile={false}
              usernameRef={usernameRef}
              mobileUsernameRef={mobileUsernameRef}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onSubmit={handleSubmit}
            />
            <DemoNotice isMobile={false} />
          </div>

          {/* Desktop Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p className="text-xs text-gray-500 text-center">
              Secured with enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
