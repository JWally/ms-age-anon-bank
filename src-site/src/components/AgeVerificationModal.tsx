import React, { useState, useEffect, useRef } from "react";

interface AgeVerificationModalProps {
  onClose: () => void;
}

interface VerificationState {
  step: "input" | "copy" | "complete";
  merchantToken: string;
  signedToken: string;
  isProcessing: boolean;
  error: string;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  onClose,
}) => {
  const [state, setState] = useState<VerificationState>({
    step: "input",
    merchantToken: "",
    signedToken: "",
    isProcessing: false,
    error: "",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const liveRef = useRef<HTMLDivElement | null>(null);

  // Lock page scroll + focus textarea
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => textareaRef.current?.focus(), 150);
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

  const announce = (msg: string) => {
    if (liveRef.current) liveRef.current.textContent = msg;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const updateMerchantToken = (token: string) => {
    setState((p) => ({ ...p, merchantToken: token, error: "" }));
  };

  const verifyAge = async () => {
    const token = state.merchantToken.trim();
    if (!token) {
      setState((p) => ({
        ...p,
        error: "Please provide the merchant verification token",
      }));
      announce("Please provide the merchant verification token");
      return;
    }
    if (token.length < 10) {
      setState((p) => ({
        ...p,
        error: "Invalid token format - token appears too short",
      }));
      announce("Invalid token format");
      return;
    }

    setState((p) => ({ ...p, isProcessing: true, error: "" }));
    try {
      const response = await fetch(`https://api-${location.host}/v1/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: token, // match content-type
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const signedResponse = await response.json();

      setState((p) => ({
        ...p,
        signedToken: btoa(JSON.stringify(signedResponse)),
        step: "copy",
      }));
      announce("Verification complete");
    } catch (err) {
      setState((p) => ({
        ...p,
        error:
          "Verification process failed. Please check your token and try again.",
      }));
      announce("Verification failed");
    } finally {
      setState((p) => ({ ...p, isProcessing: false }));
    }
  };

  const copyTokenAndProceed = () => {
    navigator.clipboard.writeText(state.signedToken);
    setState((p) => ({ ...p, step: "complete" }));
    announce("Token copied to clipboard");
  };

  const goBackToWebsite = () => {
    window.history.back();
  };

  const renderInputStep = () => (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      {/* Protocol Info */}
      <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              Privacy-First Verification
            </h3>
            <ul className="list-disc list-outside text-sm text-blue-800 leading-relaxed mb-3 pl-3 space-y-1">
              <li>We only reveal whether you are over 18 or over 21</li>
              <li>Your information is never transmitted to anyone else</li>
              <li>We cannot see where this verification is being used</li>
            </ul>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-blue-700">KYC/AML Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-blue-700">GLBA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Input */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Step 2: Paste Verification Token
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={state.merchantToken}
              onChange={(e) => updateMerchantToken(e.target.value)}
              placeholder="Paste the verification token received from the merchant..."
              rows={4}
              className="w-full px-4 py-3 text-sm font-mono text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              disabled={state.isProcessing}
            />
            <div className="absolute top-3 right-3">
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error */}
        {state.error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
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
              <p className="text-sm text-red-600 font-medium">{state.error}</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={verifyAge}
          disabled={state.isProcessing || !state.merchantToken.trim()}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {state.isProcessing ? (
            <>
              <div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                style={{ animation: "spin 1s linear infinite" }}
              />
              <span>Processing Verification...</span>
            </>
          ) : (
            <>
              <span>Verify Age & Sign Token</span>
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
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 rounded-xl">
        {[
          { label: "Standard", value: "KYC Level 3", icon: "certificate" },
          { label: "Encryption", value: "AES-256", icon: "lock" },
          { label: "Validity", value: "24 Hours", icon: "clock" },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
              {stat.icon === "certificate" && (
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              )}
              {stat.icon === "lock" && (
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              )}
              {stat.icon === "clock" && (
                <svg
                  className="w-4 h-4 text-blue-600"
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
              )}
            </div>
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className="text-sm font-semibold text-blue-600">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCopyStep = () => (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      {/* Success Header */}
      <div className="text-center mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">
          Verification Complete
        </h3>
        <p className="text-green-800">
          Identity verified • Age requirement satisfied
        </p>
      </div>

      {/* Signed Token */}
      <div className="space-y-4 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cryptographically Signed Token
        </label>
        <div className="relative">
          <textarea
            value={state.signedToken}
            readOnly
            rows={4}
            className="w-full px-4 py-3 text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 rounded-lg resize-none focus:outline-none"
          />
        </div>
        <p className="text-sm text-gray-500 italic text-center">
          Click the button below to copy this token to your clipboard
        </p>
      </div>

      {/* Copy Button */}
      <button
        onClick={copyTokenAndProceed}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <span>Copy Token</span>
      </button>

      {/* Verification Details */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Verification Details</span>
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Verification ID:</span>
            <span className="font-mono text-xs text-gray-800 bg-white px-2 py-1 rounded">
              IB-VER-{Date.now().toString().slice(-6)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Issued:</span>
            <span className="text-gray-800">{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Expires:</span>
            <span className="text-gray-800">
              {new Date(Date.now() + 86400000).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      {/* Success Header */}
      <div className="text-center mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Token Copied!</h3>
        <p className="text-green-800">
          Your verification token has been copied to your clipboard
        </p>
      </div>

      {/* Instructions */}
      <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              Your verification token is now ready to use. Return to the
              merchant's website and paste the token when prompted to complete
              your age verification.
            </p>
          </div>
        </div>
      </div>

      {/* Go Back Button */}
      <button
        onClick={goBackToWebsite}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Go Back to Your Website</span>
      </button>

      {/* Token Preview (smaller) */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Token Preview
        </h4>
        <div className="text-xs font-mono text-gray-600 bg-white p-3 rounded border break-all">
          {state.signedToken.slice(0, 60)}...
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (state.step) {
      case "input":
        return "Age Verification";
      case "copy":
        return "Verification Complete";
      case "complete":
        return "Token Copied";
      default:
        return "Age Verification";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
      onClick={handleBackdropClick}
    >
      <div
        className="
          absolute inset-0 flex items-stretch justify-stretch p-0
          sm:items-center sm:justify-center sm:p-4
        "
      >
        <div
          className="
            relative bg-white w-screen h-screen
            sm:w-full sm:h-auto sm:max-w-2xl
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
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>

          {/* Header (sticky) */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center shadow-md">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {getStepTitle()}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Iron Bank KYC Division
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors group"
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
          <div className="flex-1 overflow-y-auto [overscroll-behavior:contain] [-webkit-overflow-scrolling:touch]">
            {state.step === "input" && renderInputStep()}
            {state.step === "copy" && renderCopyStep()}
            {state.step === "complete" && renderCompleteStep()}
          </div>

          {/* Footer (sticky) */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-gray-500">
              <div className="flex items-center gap-2">
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
                <span className="text-xs">
                  Iron Bank of Braavos • Est. 298 AC
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-xs">Privacy-preserving verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
