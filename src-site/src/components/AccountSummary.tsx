import React from "react";

const AccountSummary = () => {
  const accounts = [
    {
      id: "IB-001",
      name: "Primary Checking",
      type: "Business Checking Account",
      balance: 2847593.67,
      currency: "USD",
      status: "active",
    },
    {
      id: "IB-002",
      name: "Money Market",
      type: "High-Yield Savings",
      balance: 1245890.23,
      currency: "USD",
      status: "active",
    },
    {
      id: "IB-003",
      name: "Emergency Fund",
      type: "Certificate of Deposit",
      balance: 500000.0,
      currency: "USD",
      status: "locked",
    },
  ];

  const recentTransactions = [
    {
      id: "TX-9874",
      date: "2025-01-15",
      description: "Wire Transfer - Merchant Services Corp",
      amount: -45000.0,
      type: "debit",
      status: "completed",
    },
    {
      id: "TX-9873",
      date: "2025-01-14",
      description: "Interest Payment - Money Market Account",
      amount: 12750.5,
      type: "credit",
      status: "completed",
    },
    {
      id: "TX-9872",
      date: "2025-01-13",
      description: "Business Loan Disbursement",
      amount: -850000.0,
      type: "debit",
      status: "completed",
    },
    {
      id: "TX-9871",
      date: "2025-01-12",
      description: "ACH Payment - Corporate Client",
      amount: 125000.0,
      type: "credit",
      status: "pending",
    },
    {
      id: "TX-9870",
      date: "2025-01-11",
      description: "Foreign Exchange Settlement",
      amount: 78430.25,
      type: "credit",
      status: "completed",
    },
  ];

  const totalBalance = accounts
    .filter((account) => account.status === "active")
    .reduce((sum, account) => sum + account.balance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 text-gray-900 mb-2">Account Overview</h1>
          <p className="text-body text-gray-600">
            Your financial summary and recent activity
          </p>
        </div>

        {/* Total Balance Card */}
        <div className="card card-elevated mb-8">
          <div className="card-body text-center py-12">
            <h2 className="text-h4 text-gray-600 mb-4">
              Total Available Balance
            </h2>
            <div className="text-display font-bold text-blue-600 mb-4">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-body-sm text-gray-500">
              As of{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Accounts */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-h3 text-gray-900">Your Accounts</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 bg-gray-50 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-body font-semibold text-gray-900">
                          {account.name}
                        </h4>
                        <p className="text-body-sm text-gray-500">
                          {account.type} • {account.id}
                        </p>
                      </div>
                      <span
                        className={`badge text-xs font-medium ${
                          account.status === "active"
                            ? "badge-success"
                            : account.status === "locked"
                              ? "badge-warning"
                              : "badge-error"
                        }`}
                      >
                        {account.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-h4 font-bold text-gray-900">
                        {formatCurrency(account.balance)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-h3 text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4">
                {/* Transfer Funds */}
                <button className="btn btn-primary p-6 flex-col h-auto hover:bg-blue-700 transition-colors">
                  <svg
                    className="w-8 h-8 mb-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <span className="text-body-sm font-semibold">
                    Transfer Funds
                  </span>
                </button>

                {/* View Statements */}
                <button className="btn btn-outline p-6 flex-col h-auto hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-8 h-8 mb-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-body-sm font-semibold">
                    View Statements
                  </span>
                </button>

                {/* Loan Services */}
                <button className="btn btn-outline p-6 flex-col h-auto hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-8 h-8 mb-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="text-body-sm font-semibold">
                    Loan Services
                  </span>
                </button>

                {/* Investment Services */}
                <button className="btn btn-outline p-6 flex-col h-auto hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-8 h-8 mb-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span className="text-body-sm font-semibold">
                    Investment Services
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h3 className="text-h3 text-gray-900">Recent Transactions</h3>
              <button className="btn btn-outline btn-sm">View All</button>
            </div>
          </div>

          <div className="card-body">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 bg-gray-50 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-body font-medium text-gray-900 mb-1">
                        {transaction.description}
                      </div>
                      <div className="flex items-center space-x-3 text-body-sm text-gray-500">
                        <span>
                          {new Date(transaction.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span>•</span>
                        <span>{transaction.id}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div
                        className={`text-body font-bold mb-1 ${
                          transaction.type === "credit"
                            ? "status-success"
                            : "text-gray-900"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <span
                        className={`badge text-xs font-medium ${
                          transaction.status === "completed"
                            ? "badge-success"
                            : transaction.status === "pending"
                              ? "badge-warning"
                              : "badge-error"
                        }`}
                      >
                        {transaction.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 text-center">
          <p className="text-body-sm text-gray-500">
            All transactions are secured with enterprise-grade encryption • FDIC
            Insured up to $250,000 • Contact your relationship manager for
            detailed statements
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
