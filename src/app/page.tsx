"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    <main className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-12 text-white">
      {analysisResult ? (
        <BankStatementResults data={analysisResult} onReset={handleReset} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-5xl"
        >
          <div className="mb-12 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-5xl font-extrabold text-transparent drop-shadow-lg">
              Bank Statement Analyzer
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Upload a PDF bank statement to extract account details,
              transactions, and detect anomalies using AI — now with Web3
              energy.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6 shadow-xl ring-1 ring-white/20 backdrop-blur-md">
            <BankStatementUpload onAnalysisComplete={handleAnalysisComplete} />
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Smart Extraction",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                color: "from-cyan-400 to-blue-500",
                desc: "Extract account holder name, address, and statement periods from uploaded PDFs.",
              },
              {
                title: "Transaction Analysis",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                color: "from-green-400 to-emerald-500",
                desc: "AI categorizes, timestamps, and tracks every financial transaction with precision.",
              },
              {
                title: "Balance Validation",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                color: "from-purple-500 to-pink-500",
                desc: "Reconciles every transaction against balances to catch mismatches and errors.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.2 }}
                className="rounded-lg bg-white/5 p-6 text-center shadow-md ring-1 ring-white/10 backdrop-blur"
              >
                <div
                  className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${item.color} p-3`}
                >
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
}
