import React, { useState, useEffect, useRef } from "react";

// Types
interface AgeVerificationModalProps {
  onClose: () => void;
}

interface VerificationState {
  step: "input" | "result";
  merchantToken: string;
  signedToken: string;
  isProcessing: boolean;
  error: string;
  tokenCopied: boolean;
}

// Custom hook for verification flow
const useAgeVerification = () => {
  const [state, setState] = useState<VerificationState>({
    step: "input",
    merchantToken: "",
    signedToken: "",
    isProcessing: false,
    error: "",
    tokenCopied: false,
  });

  const updateMerchantToken = (token: string) => {
    setState((prev) => ({
      ...prev,
      merchantToken: token,
      error: "",
    }));
  };

  const verifyAge = async () => {
    if (!state.merchantToken.trim()) {
      setState((prev) => ({
        ...prev,
        error: "Please provide the merchant verification token",
      }));
      return;
    }

    if (state.merchantToken.length < 10) {
      setState((prev) => ({
        ...prev,
        error: "Invalid token format",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isProcessing: true,
      error: "",
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(
        "https://api-dev-jw.ironbank.click/v1/verify",
        {
          method: "POST",
          body: state.merchantToken,
          headers: {
            "content-type": "application/json",
          },
        },
      );

      const signedResponse = await response.json();

      setState((prev) => ({
        ...prev,
        signedToken: btoa(JSON.stringify(signedResponse)),
        step: "result",
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Verification process failed. Please try again.",
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
      }));
    }
  };

  const copySignedToken = () => {
    navigator.clipboard.writeText(state.signedToken);
    setState((prev) => ({ ...prev, tokenCopied: true }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, tokenCopied: false }));
    }, 2000);
  };

  return {
    ...state,
    updateMerchantToken,
    verifyAge,
    copySignedToken,
  };
};

// Main component
const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  onClose,
}) => {
  const {
    step,
    merchantToken,
    signedToken,
    isProcessing,
    error,
    tokenCopied,
    updateMerchantToken,
    verifyAge,
    copySignedToken,
  } = useAgeVerification();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    // Store original overflow value
    const originalOverflow = document.body.style.overflow;

    // Disable body scrolling
    document.body.style.overflow = "hidden";

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Auto-focus the textarea when modal mounts and we're on the input step
  useEffect(() => {
    if (step === "input") {
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100); // Small delay to ensure modal is fully rendered

      return () => clearTimeout(timer);
    }
  }, [step]);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 text-gray-900"
      onClick={handleBackdropClick}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onWheel={handleModalScroll}
        onTouchMove={handleModalScroll}
      >
        {/* Header - Fixed */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
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
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Age Verification
                </h2>
                <p className="text-sm text-gray-600">
                  Iron Bank KYC Compliance Division
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

        {/* Body - Scrollable */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          {step === "input" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-base font-semibold text-blue-900 mb-2">
                  Verification Protocol
                </h3>
                <p className="text-sm text-blue-800">
                  This service validates age claims through cryptographic
                  attestation without revealing personal information. All
                  verification processes comply with international KYC/AML
                  standards.
                </p>
                <p className="text-sm text-blue-800 mt-4">
                  GLBA Compliant. The bank doesn't share this information with
                  third parties. You do. Clever, right!?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merchant Verification Token
                </label>
                <textarea
                  ref={textareaRef}
                  value={merchantToken}
                  onChange={(e) => updateMerchantToken(e.target.value)}
                  placeholder="Paste the verification token received from the merchant..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isProcessing}
                  autoFocus
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the token provided by the requesting merchant for
                  identity verification.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-md p-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Standard</div>
                  <div className="text-sm font-semibold text-blue-600">
                    KYC Level 3
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Encryption</div>
                  <div className="text-sm font-semibold text-blue-600">
                    AES-256
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Validity</div>
                  <div className="text-sm font-semibold text-blue-600">
                    24 Hours
                  </div>
                </div>
              </div>

              <button
                onClick={verifyAge}
                disabled={isProcessing || !merchantToken.trim()}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                    Processing Verification...
                  </div>
                ) : (
                  "Verify Age & Sign Token"
                )}
              </button>
            </div>
          )}

          {step === "result" && (
            <div className="space-y-6">
              <div className="text-center bg-green-50 border border-green-200 rounded-md p-6">
                <div className="flex justify-center mb-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Verification Complete
                </h3>
                <p className="text-sm text-green-800">
                  Identity verified • Age requirement satisfied
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cryptographically Signed Token
                </label>
                <div className="flex gap-3">
                  <textarea
                    value={signedToken}
                    readOnly
                    rows={4}
                    className="flex-1 px-3 py-2 text-xs font-mono text-blue-600 bg-blue-50 border border-blue-200 rounded-md"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 pt-1">
                  ( Return this signed token to the merchant to complete the
                  verification process )
                </p>
              </div>

              <button
                onClick={copySignedToken}
                className={`w-full py-3 px-4 font-medium rounded-md ${
                  tokenCopied
                    ? "text-green-600 bg-white border border-green-300"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tokenCopied ? "Copied" : "Copy Token"}
              </button>

              <div className="bg-gray-50 rounded-md p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Verification Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Verification ID:</span>
                    <span className="font-mono text-gray-700">
                      IB-VER-{Date.now()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Issued:</span>
                    <span className="text-gray-700">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expires:</span>
                    <span className="text-gray-700">
                      {new Date(Date.now() + 86400000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Complete Verification
              </button>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex-shrink-0">
          <div className="w-full text-center">
            <p className="text-xs text-gray-500 mb-1">
              Iron Bank of Braavos • Established 298 AC • Member FDIC
            </p>
            <p className="text-xs text-gray-400">
              Privacy-preserving verification powered by enterprise security
              standards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
