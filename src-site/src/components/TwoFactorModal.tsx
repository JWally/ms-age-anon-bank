// src/components/TwoFactorModal.tsx
import React, { useState, useEffect, useRef } from "react";

interface TwoFactorModalProps {
  username: string;
  onSuccess: () => void;
  onClose: () => void;
}

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  username,
  onSuccess,
  onClose,
}) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Auto-focus the first input when modal mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100); // Small delay to ensure modal is fully rendered

    return () => clearTimeout(timer);
  }, []);

  // Countdown timer for resending code
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

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

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take last character
    setCode(newCode);
    setError(""); // Clear error when user types

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (newCode.every((digit) => digit !== "") && !isLoading) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (codeString?: string) => {
    const submitCode = codeString || code.join("");

    if (submitCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Demo: Accept any 6-digit code
      onSuccess();
    } catch (err) {
      setError("Invalid verification code. Please try again.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    setTimeLeft(60);
    setError("");
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData.length === 6) {
      const newCode = pastedData.split("");
      setCode(newCode);
      handleSubmit(pastedData);
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
        className="modal text-gray-700"
        onWheel={handleModalScroll}
        onTouchMove={handleModalScroll}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-h3 text-gray-900">
                  Two-Factor Authentication
                </h2>
                <p className="text-body-sm text-gray-600">
                  Welcome back,{" "}
                  <span className="font-medium text-blue-600">{username}</span>
                </p>
              </div>
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
          <div className="text-center mb-6">
            <p className="text-body-sm text-gray-600">
              Enter the 6-digit verification code from your authenticator app
            </p>
          </div>

          {/* Code Input */}
          <div className="mb-6">
            <div
              className="flex justify-center space-x-3 mb-4"
              onPaste={handlePaste}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  // @ts-expect-error: dont know
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-blue text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={1}
                  disabled={isLoading}
                  autoComplete="off"
                  inputMode="numeric"
                  // Auto-focus first input (backup method)
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || code.some((digit) => !digit)}
              className="btn btn-primary w-full mb-4"
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
                  Verifying...
                </div>
              ) : (
                "Verify & Continue"
              )}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-body-sm text-gray-500">
                  Didn't receive a code? Resend in {timeLeft}s
                </p>
              ) : (
                <button
                  onClick={handleResendCode}
                  className="text-body-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Resend verification code
                </button>
              )}
            </div>
          </div>

          {/* Demo Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
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
                  For demonstration purposes, any 6-digit code will be accepted.
                  Try entering: 123456
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer bg-gray-50">
          <p className="text-caption text-gray-500 text-center w-full">
            Your account is protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;
