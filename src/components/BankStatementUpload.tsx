"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "~/trpc/react";
import type { BankStatementData } from "~/types/bank-statement";

interface BankStatementUploadProps {
  onAnalysisComplete?: (data: BankStatementData) => void;
}

const financialTips = [
  "Review your monthly expenses to identify areas where you can save money.",
  "Set up automatic transfers to your savings account each month.",
  "Pay your bills on time to avoid late fees and maintain a good credit score.",
  "Create a budget and stick to it to track your spending and achieve your financial goals.",
  "Consider investing in a diversified portfolio to grow your wealth over time.",
];

export default function BankStatementUpload({
  onAnalysisComplete,
}: BankStatementUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const analyzeMutation = api.bankStatement.analyze.useMutation({
    onSuccess: (result) => {
      if (result.success && result.data) {
        onAnalysisComplete?.(result.data);
      }
    },
  });

  const handleFileSelect = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && files[0]) handleFileSelect(files[0]);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0 && files[0]) handleFileSelect(files[0]);
    },
    [handleFileSelect],
  );

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setProgress(0); // Reset progress
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        return newProgress > 75 ? 75 : newProgress; // Cap at 75%
      });
    }, 500);

    try {
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Content = result.split(",")[1] || "";
          resolve(base64Content);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      await analyzeMutation.mutateAsync({
        fileContent,
        fileName: selectedFile.name,
      });
      setProgress(100);
    } finally {
      clearInterval(intervalId);
      setTimeout(() => setProgress(0), 2000);
    }
  }, [selectedFile, analyzeMutation]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % financialTips.length);
    }, 5000); // Change tip every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full p-6">
      <div
        className={`relative rounded-lg border border-white/10 bg-white/[0.01] p-4 text-center transition-all duration-300 ${
          dragActive
            ? "ring-2 ring-blue-400/60 ring-offset-1"
            : "hover:ring-1 hover:ring-blue-300/40"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="mb-5 text-center">
          <h2 className="mb-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-2xl font-extrabold text-transparent">
            Bank Statement Analyzer
          </h2>
          <p className="text-sm text-zinc-400">
            Upload your bank statement PDF to unlock AI-powered insights
          </p>
        </div>

        <div
          className={`relative rounded-xl border border-white/10 bg-[#302b63] p-6 text-center transition-all duration-300 ${
            dragActive
              ? "ring-2 ring-blue-400 ring-offset-2"
              : "hover:ring-1 hover:ring-blue-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />

          {selectedFile ? (
            <div className="space-y-4 text-white">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-700/30 p-3 shadow-inner">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-semibold">{selectedFile.name}</p>
                <p className="text-sm text-zinc-400">
                  {selectedFile.size < 1024 * 1024
                    ? (selectedFile.size / 1024).toFixed(2) + " KB"
                    : (selectedFile.size / 1024 / 1024).toFixed(2) + " MB"}
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-sm text-red-400 hover:text-red-500"
              >
                Remove this file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg
                  className="h-10 w-10 text-blue-400/60"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-white"
                >
                  <span className="font-medium text-blue-400 hover:text-blue-300">
                    Click to upload
                  </span>{" "}
                  <span className="text-zinc-400">or drag and drop</span>
                </label>
                <p className="mt-1 text-xs text-zinc-500">
                  Only PDF files under 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="mt-5">
            <button
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:from-pink-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {analyzeMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                " Analyze Bank Statement"
              )}
            </button>
          </div>
        )}

        {analyzeMutation.isPending && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-zinc-400">
              {financialTips[currentTipIndex]}
            </p>
            <div className="h-2 rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {analyzeMutation.error && (
          <div className="mt-4 rounded-md border border-red-400 bg-red-800/20 p-3 text-sm text-red-300 shadow-sm">
            ❌ Error: {analyzeMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
}
