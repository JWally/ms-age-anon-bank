import React from "react";
// @ts-expect-error: any
const LandingPage = ({ onLoginClick, onAgeVerificationClick }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="nav">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            <div className="logo text-2xl">Iron Bank</div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLoginClick}
                className="btn btn-primary btn-ghost hidden sm:inline-flex"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-display text-gray-900 mb-6">Iron Bank</h1>
            <h2 className="text-h2 text-gray-600 mb-6">
              Premier Financial Institution
            </h2>
            <p className="text-body-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Established 298 AC. Providing secure banking, investment
              management, and financial services to institutions worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={onLoginClick}
                className="btn btn-primary btn-lg w-full sm:w-auto"
              >
                User Log In
              </button>
              <button
                onClick={onAgeVerificationClick}
                className="btn btn-secondary w-full btn-lg w-full sm:w-auto"
              >
                Age Verification
              </button>
            </div>

            <p className="text-caption text-gray-400">
              Fully compliant with international KYC/AML regulations
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-h2 text-gray-900 mb-4">
              Institutional Excellence
            </h3>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              Five centuries of uninterrupted service to global financial
              markets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Security */}
            <div className="card text-center">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h4 className="text-h4 text-gray-900 mb-3">Maximum Security</h4>
                <p className="text-body text-gray-600">
                  Multi-layered security protocols protect your assets through
                  all market conditions.
                </p>
              </div>
            </div>

            {/* Privacy */}
            <div className="card text-center">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-h4 text-gray-900 mb-3">Complete Privacy</h4>
                <p className="text-body text-gray-600">
                  Absolute confidentiality guaranteed. Your financial affairs
                  remain strictly private.
                </p>
              </div>
            </div>

            {/* Performance */}
            <div className="card text-center">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.293a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h4 className="text-h4 text-gray-900 mb-3">
                  Proven Performance
                </h4>
                <p className="text-body text-gray-600">
                  Consistent returns across market cycles with investment
                  strategies spanning continents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-h2 text-gray-900 mb-8">Financial Services</h3>
              <div className="space-y-lg">
                <div>
                  <h4 className="text-h4 text-gray-900 mb-2">
                    Private Banking
                  </h4>
                  <p className="text-body text-gray-600">
                    Personalized wealth management and advisory services for
                    high-net-worth individuals and institutions.
                  </p>
                </div>
                <div>
                  <h4 className="text-h4 text-gray-900 mb-2">
                    Corporate Finance
                  </h4>
                  <p className="text-body text-gray-600">
                    Comprehensive corporate banking solutions including trade
                    finance, treasury management, and credit facilities.
                  </p>
                </div>
                <div>
                  <h4 className="text-h4 text-gray-900 mb-2">
                    Identity Verification
                  </h4>
                  <p className="text-body text-gray-600">
                    Secure, anonymous age verification services with
                    cryptographic attestation for regulatory compliance.
                  </p>
                </div>
              </div>
            </div>
            <div className="card card-elevated">
              <div className="card-body">
                <h4 className="text-h4 text-gray-900 mb-6">
                  Get Started Today
                </h4>
                <p className="text-body text-gray-600 mb-6">
                  Join thousands of institutions who trust Iron Bank with their
                  financial operations.
                </p>
                <div className="space-y-md">
                  <button
                    onClick={onLoginClick}
                    className="btn btn-primary w-full"
                  >
                    Open Account
                  </button>
                  <button
                    onClick={onAgeVerificationClick}
                    className="btn btn-outline w-full"
                  >
                    Verify Identity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-display font-bold text-blue-600 mb-2">
                500+
              </div>
              <div className="text-caption text-gray-500">Years of Service</div>
            </div>
            <div>
              <div className="text-display font-bold text-blue-600 mb-2">
                50K+
              </div>
              <div className="text-caption text-gray-500">Global Clients</div>
            </div>
            <div>
              <div className="text-display font-bold text-blue-600 mb-2">
                99.9%
              </div>
              <div className="text-caption text-gray-500">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-display font-bold text-blue-600 mb-2">
                24/7
              </div>
              <div className="text-caption text-gray-500">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section bg-gray-900 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="logo text-2xl text-white mb-4">Iron Bank</div>
              <p className="text-body-sm text-gray-300">
                Established 298 AC
                <br />
                Member FDIC • Equal Housing Lender
              </p>
            </div>

            <div>
              <h4 className="text-h4 text-white mb-4">Services</h4>
              <ul className="space-y-sm text-body-sm text-gray-300">
                <li>Private Banking</li>
                <li>Corporate Finance</li>
                <li>Identity Verification</li>
                <li>Regulatory Compliance</li>
              </ul>
            </div>

            <div>
              <h4 className="text-h4 text-white mb-4">Company</h4>
              <ul className="space-y-sm text-body-sm text-gray-300">
                <li>About Us</li>
                <li>Leadership</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>

            <div>
              <h4 className="text-h4 text-white mb-4">Contact</h4>
              <div className="text-body-sm text-gray-300">
                <p>
                  1 Iron Square
                  <br />
                  Braavos, Free Cities
                </p>
                <p className="mt-2">SWIFT: IRNBBRAA</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-700 text-center">
            <p className="text-body-sm text-gray-400">
              © 2025 Iron Bank of Braavos. All rights reserved. Equal
              Opportunity Lender.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
