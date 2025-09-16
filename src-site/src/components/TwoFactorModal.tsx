import React, { useState, useEffect, useRef } from "react";

interface TwoFactorModalProps {
  username: string;
  onSuccess: () => void;
  onClose: () => void;
}

// Move CodeInputs outside to prevent recreation on every render
interface CodeInputsProps {
  code: string[];
  error: string;
  isLoading: boolean;
  timeLeft: number;
  isMobile: boolean;
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  mobileInputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  onInputChange: (index: number, value: string, isMobile?: boolean) => void;
  onKeyDown: (
    index: number,
    e: React.KeyboardEvent,
    isMobile?: boolean,
  ) => void;
  onSubmit: () => void;
  onResendCode: () => void;
  onPaste: (e: React.ClipboardEvent) => void;
}

const CodeInputs: React.FC<CodeInputsProps> = ({
  code,
  error,
  isLoading,
  timeLeft,
  isMobile,
  inputRefs,
  mobileInputRefs,
  onInputChange,
  onKeyDown,
  onSubmit,
  onResendCode,
  onPaste,
}) => (
  <div className={isMobile ? "mb-4" : "mb-6"}>
    <div className="text-center mb-4">
      <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600`}>
        Enter the 6-digit verification code from your authenticator app
      </p>
    </div>

    <div
      className={`flex justify-center ${isMobile ? "space-x-2" : "space-x-3"} ${isMobile ? "mb-3" : "mb-4"}`}
      onPaste={onPaste}
    >
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            if (isMobile) {
              if (mobileInputRefs.current) {
                mobileInputRefs.current[index] = el;
              }
            } else {
              if (inputRefs.current) {
                inputRefs.current[index] = el;
              }
            }
          }}
          type="text"
          value={digit}
          onChange={(e) => onInputChange(index, e.target.value, isMobile)}
          onKeyDown={(e) => onKeyDown(index, e, isMobile)}
          className={`${isMobile ? "w-10 h-10 text-lg" : "w-12 h-12 text-xl"} text-center font-semibold text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          maxLength={1}
          disabled={isLoading}
          autoComplete="off"
          inputMode="numeric"
          autoFocus={index === 0}
        />
      ))}
    </div>

    {error && (
      <div
        className={`bg-red-50 border border-red-200 rounded-md ${isMobile ? "p-2.5 mb-3" : "p-3 mb-4"}`}
      >
        <p
          className={`text-red-600 ${isMobile ? "text-xs" : "text-sm"} text-center`}
        >
          {error}
        </p>
      </div>
    )}

    <button
      onClick={onSubmit}
      disabled={isLoading || code.some((digit) => !digit)}
      className={`w-full ${isMobile ? "py-2.5 px-3 text-sm mb-3" : "py-3 px-4 text-sm mb-4"} bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
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
          Verifying...
        </div>
      ) : (
        "Verify & Continue"
      )}
    </button>

    {/* Resend Code */}
    <div className="text-center">
      {timeLeft > 0 ? (
        <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}>
          Didn't receive a code? Resend in {timeLeft}s
        </p>
      ) : (
        <button
          onClick={onResendCode}
          className={`${isMobile ? "text-xs" : "text-sm"} text-blue-600 hover:text-blue-700 font-medium`}
        >
          Resend verification code
        </button>
      )}
    </div>
  </div>
);

// Move DemoNotice outside as well
interface DemoNoticeProps {
  isMobile: boolean;
}

const DemoNotice: React.FC<DemoNoticeProps> = ({ isMobile }) => (
  <div
    className={`bg-blue-50 border border-blue-200 rounded-md ${isMobile ? "p-3" : "p-4"}`}
  >
    <div className="flex">
      <svg
        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-blue-400 mt-0.5 ${isMobile ? "mr-2.5" : "mr-3"} flex-shrink-0`}
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
          For demonstration purposes, any 6-digit code will be accepted. Try
          entering: 123456
        </p>
      </div>
    </div>
  </div>
);

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
  const mobileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      if (mobileInputRefs.current[0]) {
        mobileInputRefs.current[0].focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Countdown timer for resending code
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

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

  const handleInputChange = (
    index: number,
    value: string,
    isMobile: boolean = false,
  ) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take last character
    setCode(newCode);
    setError(""); // Clear error when user types

    // Auto-focus next input
    if (value && index < 5) {
      if (isMobile) {
        mobileInputRefs.current[index + 1]?.focus();
      } else {
        inputRefs.current[index + 1]?.focus();
      }
    }

    // Auto-submit when all digits are entered
    if (newCode.every((digit) => digit !== "") && !isLoading) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    isMobile: boolean = false,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      if (isMobile) {
        mobileInputRefs.current[index - 1]?.focus();
      } else {
        inputRefs.current[index - 1]?.focus();
      }
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
      mobileInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    setTimeLeft(60);
    setError("");
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    mobileInputRefs.current[0]?.focus();
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
    <>
      {/* Mobile: Fullscreen Modal */}
      <div className="fixed inset-0 z-50 sm:hidden bg-gray-50 flex flex-col">
        {/* Mobile Header - Sticky */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-2.5">
                <svg
                  className="w-4 h-4 text-blue-600"
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
                <h2 className="text-base font-semibold text-gray-900">
                  Two-Factor Authentication
                </h2>
                <p className="text-xs text-gray-600">
                  Welcome back,{" "}
                  <span className="font-medium text-blue-600">{username}</span>
                </p>
              </div>
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
          <CodeInputs
            code={code}
            error={error}
            isLoading={isLoading}
            timeLeft={timeLeft}
            isMobile={true}
            inputRefs={inputRefs}
            mobileInputRefs={mobileInputRefs}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSubmit={() => handleSubmit()}
            onResendCode={handleResendCode}
            onPaste={handlePaste}
          />
          <DemoNotice isMobile={true} />
        </div>

        {/* Mobile Footer - Sticky */}
        <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-4 py-3">
          <p className="text-[10px] text-gray-500 text-center">
            Your account is protected by enterprise-grade security
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
                  <h2 className="text-xl font-semibold text-gray-900">
                    Two-Factor Authentication
                  </h2>
                  <p className="text-sm text-gray-600">
                    Welcome back,{" "}
                    <span className="font-medium text-blue-600">
                      {username}
                    </span>
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

          {/* Desktop Body */}
          <div className="px-6 py-6 text-gray-700">
            <CodeInputs
              code={code}
              error={error}
              isLoading={isLoading}
              timeLeft={timeLeft}
              isMobile={false}
              inputRefs={inputRefs}
              mobileInputRefs={mobileInputRefs}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onSubmit={() => handleSubmit()}
              onResendCode={handleResendCode}
              onPaste={handlePaste}
            />
            <DemoNotice isMobile={false} />
          </div>

          {/* Desktop Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p className="text-xs text-gray-500 text-center">
              Your account is protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TwoFactorModal;
