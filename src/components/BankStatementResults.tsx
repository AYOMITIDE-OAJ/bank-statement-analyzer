// src/components/BankStatementResults.tsx

"use client";

import type {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";
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
    !data ||
    !data.accountHolderName ||
    !data.accountHolderAddress ||
    data.documentDate === undefined ||
    data.startingBalance === undefined ||
    data.endingBalance === undefined ||
    !data.transactions ||
    data.calculatedBalance === undefined ||
    data.isReconciled === undefined ||
    data.balanceDifference === undefined
  ) {
    return (
      <div className="mx-auto w-full max-w-6xl p-6">
        <p className="text-red-600">Invalid data to display.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
        <button
          onClick={onReset}
          className="rounded-lg border border-blue-300 px-4 py-2 text-blue-600 transition-colors hover:border-blue-400 hover:text-blue-700"
        >
          Analyze Another Statement
        </button>
      </div>

      {/* Account Information */}
      <div className="rounded-lg border bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Account Information
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Account Holder</p>
            <p className="text-lg text-gray-900">{data.accountHolderName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="whitespace-pre-line text-gray-900">
              {data.accountHolderAddress}
            </p>
          </div>
          {data.documentDate && (
            <div>
              <p className="text-sm font-medium text-gray-500">
                Statement Date
              </p>
              <p className="text-lg text-gray-900">
                {formatDate(data.documentDate)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Balance Summary */}
      <div className="rounded-lg border bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Balance Summary
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
              Starting Balance
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.startingBalance)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Ending Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.endingBalance)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
              Calculated Balance
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.calculatedBalance)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
              Reconciliation Status
            </p>
            <div className="mt-2 flex items-center justify-center">
              {data.isReconciled ? (
                <div className="flex items-center text-green-600">
                  <svg
                    className="mr-1 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">Reconciled</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <svg
                    className="mr-1 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">
                    Difference: {formatCurrency(data.balanceDifference)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="rounded-lg border bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Transaction Summary
        </h3>
        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
              Total Transactions
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {data.transactions.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Total Credits</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(
                data.transactions
                  .filter((t: { type: string }) => t.type === "credit")
                  .reduce((sum: any, t: { amount: any }) => sum + t.amount, 0),
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Total Debits</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(
                Math.abs(
                  data.transactions
                    .filter((t: { type: string }) => t.type === "debit")
                    .reduce(
                      (sum: any, t: { amount: any }) => sum + t.amount,
                      0,
                    ),
                ),
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-lg">
        <div className="border-b p-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Transaction History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Amount
                </th>
                {data.transactions.some((t) => t.balance !== undefined) && (
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Running Balance
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type === "credit" ? "Credit" : "Debit"}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-right text-sm font-medium whitespace-nowrap ${
                      transaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : ""}
                    {formatCurrency(transaction.amount)}
                  </td>
                  {data.transactions.some((t) => t.balance !== undefined) && (
                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                      {transaction.balance !== undefined
                        ? formatCurrency(transaction.balance)
                        : "-"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Validation Messages */}
      {!data.isReconciled && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex">
            <svg
              className="mt-0.5 mr-3 h-5 w-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Balance Discrepancy Detected
              </h4>
              <p className="mt-1 text-sm text-yellow-700">
                The calculated balance ({formatCurrency(data.calculatedBalance)}
                ) does not match the ending balance (
                {formatCurrency(data.endingBalance)}). Difference:{" "}
                {formatCurrency(data.balanceDifference)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
