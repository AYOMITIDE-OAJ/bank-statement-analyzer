"use client";

import type { BankStatementData } from "../types/bank-statement";

interface BankStatementResultsProps {
  data: BankStatementData;
  onReset: () => void;
}

export default function BankStatementResults({
  data,
  onReset,
}: BankStatementResultsProps) {
  if (
    !data?.accountHolderName ||
    !data?.accountHolderAddress ||
    data?.documentDate == null ||
    data?.startingBalance == null ||
    data?.endingBalance == null ||
    !data?.transactions ||
    data?.calculatedBalance == null ||
    data?.isReconciled == null ||
    data?.balanceDifference == null
  ) {
    return (
      <div className="mx-auto w-full max-w-6xl p-6 text-center">
        <p className="text-red-500">Invalid data to display.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analysis Results</h2>
        <button
          onClick={onReset}
          className="rounded-lg border border-cyan-500 px-4 py-2 text-cyan-400 transition hover:bg-cyan-900/30"
        >
          Analyze Another
        </button>
      </div>

      {/* Account Info */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-md backdrop-blur-sm">
        <h3 className="mb-4 text-xl font-semibold text-cyan-400">
          Account Information
        </h3>
        <div className="grid gap-4 text-gray-200 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-400">Holder</p>
            <p className="text-lg font-medium">{data.accountHolderName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Address</p>
            <p className="whitespace-pre-line">{data.accountHolderAddress}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Statement Date</p>
            <p className="text-lg font-medium">
              {data.documentDate ? formatDate(data.documentDate) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Balance Summary */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-md backdrop-blur-sm">
        <h3 className="mb-4 text-xl font-semibold text-cyan-400">
          Balance Summary
        </h3>
        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-gray-400">Starting Balance</p>
            <p className="text-2xl font-bold">
              {formatCurrency(data.startingBalance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Ending Balance</p>
            <p className="text-2xl font-bold">
              {formatCurrency(data.endingBalance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Calculated Balance</p>
            <p className="text-2xl font-bold">
              {formatCurrency(data.calculatedBalance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Reconciliation</p>
            <div className="mt-2 text-lg font-semibold">
              {data.isReconciled ? (
                <span className="text-green-400">✅ Reconciled</span>
              ) : (
                <span className="text-red-500">
                  ❌ Difference: {formatCurrency(data.balanceDifference)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-md backdrop-blur-sm">
        <h3 className="mb-4 text-xl font-semibold text-cyan-400">
          Transaction Summary
        </h3>
        <div className="grid gap-6 text-center md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-400">Total Transactions</p>
            <p className="text-2xl font-bold">{data.transactions.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Credits</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(
                data.transactions
                  .filter((t) => t.type === "credit")
                  .reduce((sum, t) => sum + t.amount, 0),
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Debits</p>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(
                data.transactions
                  .filter((t) => t.type === "debit")
                  .reduce((sum, t) => sum + t.amount, 0),
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 shadow-md backdrop-blur-sm">
        <div className="border-b border-white/10 p-6">
          <h3 className="text-xl font-semibold text-cyan-400">
            Transaction History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-cyan-300 uppercase">
                  Amount
                </th>
                {data.transactions.some((t) => t.balance !== undefined) && (
                  <th className="px-6 py-3 text-right text-xs font-semibold text-cyan-300 uppercase">
                    Running Balance
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((t, i) => (
                <tr key={`${i}-${t.description}`} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm">{formatDate(t.date)}</td>
                  <td className="px-6 py-4 text-sm">{t.description}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        t.type === "credit"
                          ? "bg-green-400/10 text-green-300"
                          : "bg-red-400/10 text-red-300"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-right text-sm ${
                      t.type === "credit" ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {formatCurrency(t.amount)}
                  </td>
                  {t.balance !== undefined && (
                    <td className="px-6 py-4 text-right text-sm">
                      {formatCurrency(t.balance)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
