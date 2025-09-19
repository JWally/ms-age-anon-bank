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
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const liveRef = useRef<HTMLDivElement | null>(null);

  // Lock page scroll; focus first cell
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 150);
    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(t);
    };
  }, []);

  // ESC to close
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const announce = (msg: string) => {
    if (!liveRef.current) return;
    liveRef.current.textContent = msg;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleInputChange = (index: number, value: string) => {
    // Allow digits only
    if (!/^\d*$/.test(value)) return;

    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (error) setError("");

    // Advance on entry
    if (value && index < 5) inputRefs.current[index + 1]?.focus();

    // Auto-submit when filled
    if (next.every((d) => d !== "") && !isLoading) {
      handleSubmit(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "Enter" && !isLoading) handleSubmit();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    if (pasted.length === 6) {
      const next = pasted.slice(0, 6).split("");
      setCode(next);
      announce("Code pasted");
      handleSubmit(next.join(""));
    } else {
      // Fill as much as possible from current focus
      const start = inputRefs.current.findIndex(
        (el) => el === document.activeElement,
      );
      const s = Math.max(0, start);
      const next = [...code];
      let j = 0;
      for (let i = s; i < 6 && j < pasted.length; i++, j++) next[i] = pasted[j];
      setCode(next);
      if (next.every((d) => d !== "") && !isLoading)
        handleSubmit(next.join(""));
    }
  };

  const handleSubmit = async (codeString?: string) => {
    const submit = codeString ?? code.join("");
    if (submit.length !== 6) {
      setError("Please enter all 6 digits");
      announce("Please enter all six digits");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 1200));
      onSuccess();
    } catch {
      setError("Invalid verification code. Please try again.");
      announce("Invalid verification code");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    await new Promise((r) => setTimeout(r, 800));
    setTimeLeft(60);
    setError("");
    setCode(["", "", "", "", "", ""]);
    setIsResending(false);
    inputRefs.current[0]?.focus();
    announce("Verification code resent");
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 flex items-stretch justify-stretch p-0 sm:items-center sm:justify-center sm:p-4">
        <div
          className="
            relative bg-white w-screen h-screen
            sm:w-full sm:h-auto sm:max-w-lg
            sm:rounded-2xl sm:border sm:border-gray-100
            shadow-2xl flex flex-col overflow-hidden
            animate-[modalIn_0.22s_cubic-bezier(.16,1,.3,1)]
          "
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <style jsx>{`
            @keyframes modalIn {
              from {
                opacity: 0;
                transform: translateY(8px) scale(0.985);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes pulse {
              0%,
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
            }
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
            @keyframes shake {
              0%,
              100% {
                transform: translateX(0);
              }
              25% {
                transform: translateX(-4px);
              }
              75% {
                transform: translateX(4px);
              }
            }
          `}</style>

          {/* Header (sticky) */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.4}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Secure Access
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Welcome back,{" "}
                    <span className="font-semibold text-blue-600">
                      {username}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors group"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
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

          {/* SR live region */}
          <div ref={liveRef} aria-live="polite" className="sr-only" />

          {/* Scrollable content */}
          <div
            className="flex-1 overflow-y-auto px-6 py-6 [overscroll-behavior:contain] [-webkit-overflow-scrolling:touch]"
            onPaste={handlePaste}
          >
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-2">
                  Enter the 6-digit verification code from your authenticator
                  app
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    style={{ animation: "pulse 2s infinite" }}
                  />
                  <span className="text-sm text-blue-700 font-medium">
                    Awaiting verification
                  </span>
                </div>
              </div>

              {/* OTP inputs */}
              <div className="flex justify-center gap-3 mb-6">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d*"
                    value={digit}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    maxLength={1}
                    disabled={isLoading}
                    aria-label={`Digit ${i + 1}`}
                    className={`
                      w-12 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 rounded-xl transition-all
                      ${digit ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md" : "border-gray-200 bg-gray-50 text-gray-900 hover:border-gray-300"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${error ? "border-red-300 bg-red-50" : ""}
                    `}
                    style={error ? { animation: "shake 0.5s ease-in-out" } : {}}
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-red-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={() => handleSubmit()}
                disabled={isLoading || code.some((d) => !d)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
              >
                {isLoading ? (
                  <>
                    <div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Resend */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">
                      Resend code in{" "}
                      <span className="font-mono font-semibold">
                        {formatTime(timeLeft)}
                      </span>
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {isResending ? (
                      <>
                        <div
                          className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full"
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span>Resend verification code</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Demo Notice */}
              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Demo Environment
                    </h4>
                    <p className="text-sm text-blue-700">
                      For demonstration purposes, any 6-digit code will be
                      accepted. Try:{" "}
                      <span className="font-mono font-semibold">123456</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer (sticky) */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <p className="text-xs">Protected by enterprise-grade security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;
