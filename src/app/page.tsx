"use client";

import { useState } from "react";
import BankStatementUpload from "~/components/BankStatementUpload";
import BankStatementResults from "~/components/BankStatementResults";
import type { BankStatementData } from "~/types/bank-statement";

export default function HomePage() {
  const [analysisResult, setAnalysisResult] =
    useState<BankStatementData | null>(null);

  const handleAnalysisComplete = (data: BankStatementData) => {
    setAnalysisResult(data);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      {analysisResult ? (
        <BankStatementResults data={analysisResult} onReset={handleReset} />
      ) : (
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Bank Statement Analyzer
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Upload a PDF bank statement to automatically extract account
              information, transactions, and validate balance reconciliation
              using AI-powered analysis.
            </p>
          </div>

          <BankStatementUpload onAnalysisComplete={handleAnalysisComplete} />

          {/* Features Section */}
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
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
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Smart Extraction
              </h3>
              <p className="text-gray-600">
                Automatically extracts account holder information, addresses,
                and statement dates from PDF documents.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Transaction Analysis
              </h3>
              <p className="text-gray-600">
                Identifies and categorizes all transactions with dates,
                descriptions, and amounts.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 p-3">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Balance Validation
              </h3>
              <p className="text-gray-600">
                Automatically reconciles transactions against starting and
                ending balances to detect discrepancies.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
