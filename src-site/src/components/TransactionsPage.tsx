// src/components/TransactionsPage.tsx
import React, { useState } from "react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  status: "completed" | "pending" | "failed";
  category: string;
  reference?: string;
  counterparty?: string;
}

const TransactionsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Updated mock transaction data with realistic financial transactions
  const allTransactions: Transaction[] = [
    {
      id: "TX-9874",
      date: "2025-01-15",
      description: "Wire Transfer - Merchant Services Corp",
      amount: -45000.0,
      type: "debit",
      status: "completed",
      category: "Business Operations",
      counterparty: "Merchant Services Corp",
      reference: "WT-MSC-2025-001",
    },
    {
      id: "TX-9873",
      date: "2025-01-14",
      description: "Interest Payment - Money Market Account",
      amount: 12750.5,
      type: "credit",
      status: "completed",
      category: "Interest Income",
      counterparty: "Iron Bank Investment Division",
      reference: "INT-MMA-Q1-2025",
    },
    {
      id: "TX-9872",
      date: "2025-01-13",
      description: "Business Loan Disbursement",
      amount: -850000.0,
      type: "debit",
      status: "completed",
      category: "Lending",
      counterparty: "Corporate Banking Division",
      reference: "LOAN-CBD-2025-003",
    },
    {
      id: "TX-9871",
      date: "2025-01-12",
      description: "ACH Payment - Corporate Client",
      amount: 125000.0,
      type: "credit",
      status: "pending",
      category: "Receivables",
      counterparty: "Enterprise Solutions LLC",
      reference: "ACH-ESL-2024-087",
    },
    {
      id: "TX-9870",
      date: "2025-01-11",
      description: "Foreign Exchange Settlement",
      amount: 78430.25,
      type: "credit",
      status: "completed",
      category: "Currency Exchange",
      counterparty: "FX Trading Desk",
      reference: "FX-USD-2025-012",
    },
    {
      id: "TX-9869",
      date: "2025-01-10",
      description: "Corporate Bond Interest Payment",
      amount: 200000.0,
      type: "credit",
      status: "completed",
      category: "Investment Income",
      counterparty: "Bond Portfolio Management",
      reference: "BOND-INT-2024-FINAL",
    },
    {
      id: "TX-9868",
      date: "2025-01-09",
      description: "Trade Finance - Supply Chain Funding",
      amount: -156000.0,
      type: "debit",
      status: "completed",
      category: "Trade Finance",
      counterparty: "Global Supply Chain Partners",
      reference: "TF-GSCP-2025-004",
    },
    {
      id: "TX-9867",
      date: "2025-01-08",
      description: "Failed Payment - Insufficient Funds",
      amount: -75000.0,
      type: "debit",
      status: "failed",
      category: "Payment Processing",
      counterparty: "Automated Clearing House",
      reference: "PAY-ACH-2025-001-FAILED",
    },
    {
      id: "TX-9866",
      date: "2025-01-07",
      description: "Investment Return - Equity Portfolio",
      amount: 45200.75,
      type: "credit",
      status: "completed",
      category: "Investment Income",
      counterparty: "Equity Management Division",
      reference: "EQU-DIV-Q4-2024",
    },
    {
      id: "TX-9865",
      date: "2025-01-06",
      description: "Insurance Claim Processing",
      amount: 89500.0,
      type: "credit",
      status: "pending",
      category: "Insurance",
      counterparty: "Commercial Insurance Partners",
      reference: "INS-CIP-2024-156",
    },
  ];

  // Filter transactions
  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesStatus =
      filterStatus === "all" || transaction.status === filterStatus;
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesSearch =
      searchTerm === "" ||
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.counterparty
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Business Operations":
        return "text-blue-600";
      case "Interest Income":
      case "Investment Income":
        return "text-green-600";
      case "Lending":
        return "text-purple-600";
      case "Receivables":
        return "text-indigo-600";
      case "Currency Exchange":
        return "text-yellow-600";
      case "Trade Finance":
        return "text-orange-600";
      case "Insurance":
        return "text-cyan-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 text-gray-900 mb-2">Transaction History</h1>
          <p className="text-body text-gray-600">
            Complete record of all account activity and financial transactions
          </p>
        </div>

        {/* Filters and Search */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Search Transactions</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Description, reference, or counterparty..."
                  className="input"
                />
              </div>

              <div>
                <label className="form-label">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="form-label">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input"
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credits</option>
                  <option value="debit">Debits</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="btn btn-outline w-full">Export Data</button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="card text-center">
            <div className="card-body py-6">
              <div className="text-h2 font-bold text-blue-600 mb-2">
                {filteredTransactions.length}
              </div>
              <div className="text-body-sm text-gray-600">
                Total Transactions
              </div>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-body py-6">
              <div className="text-h2 font-bold status-success mb-2">
                {
                  filteredTransactions.filter((t) => t.status === "completed")
                    .length
                }
              </div>
              <div className="text-body-sm text-gray-600">Completed</div>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-body py-6">
              <div className="text-h2 font-bold status-warning mb-2">
                {
                  filteredTransactions.filter((t) => t.status === "pending")
                    .length
                }
              </div>
              <div className="text-body-sm text-gray-600">Pending</div>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-body py-6">
              <div className="text-h2 font-bold status-error mb-2">
                {
                  filteredTransactions.filter((t) => t.status === "failed")
                    .length
                }
              </div>
              <div className="text-body-sm text-gray-600">Failed</div>
            </div>
          </div>
        </div>

        {/* Transaction Cards */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-h3 text-gray-900">Transaction Details</h3>
          </div>

          <div className="card-body">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-h4 text-gray-900 mb-2">
                  No Transactions Found
                </h3>
                <p className="text-body text-gray-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 bg-gray-50 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="text-body font-medium text-gray-900 mb-1">
                          {transaction.description}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-body-sm text-gray-500 mb-2">
                          <span>
                            {new Date(transaction.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                          <span>•</span>
                          <span>{transaction.id}</span>
                          {transaction.counterparty && (
                            <>
                              <span>•</span>
                              <span>{transaction.counterparty}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-body-sm font-medium ${getCategoryColor(transaction.category)}`}
                          >
                            {transaction.category}
                          </span>
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
                      <div className="text-right ml-4">
                        <div
                          className={`text-h4 font-bold ${
                            transaction.type === "credit"
                              ? "status-success"
                              : "text-gray-900"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                        {transaction.reference && (
                          <div className="text-body-sm text-gray-500 mt-1">
                            Ref: {transaction.reference}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 text-center">
          <p className="text-body-sm text-gray-500">
            Transaction records are maintained in accordance with federal
            banking regulations • All amounts shown in USD • Contact your
            relationship manager for detailed account analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
