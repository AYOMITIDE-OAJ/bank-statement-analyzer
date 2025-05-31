"use client";

import { useState, useCallback } from "react";
import { api } from "~/trpc/react";
import type { BankStatementData } from "~/types/bank-statement";

interface BankStatementUploadProps {
  onAnalysisComplete?: (data: BankStatementData) => void;
}

export default function BankStatementUpload({
  onAnalysisComplete,
}: BankStatementUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
      // 10MB limit
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
      if (files.length > 0 && files[0]) {
        handleFileSelect(files[0]);
      }
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
      if (files.length > 0 && files[0]) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    const fileContent = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 content
        const base64Content = result.split(",")[1] || "";
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(selectedFile);
    });

    analyzeMutation.mutate({
      fileContent,
      fileName: selectedFile.name,
    });
  }, [selectedFile, analyzeMutation]);

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Bank Statement Analyzer
        </h2>
        <p className="text-gray-600">
          Upload a PDF bank statement to extract key information and validate
          transactions
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`rounded-lg border-2 border-dashed bg-transparent p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-400"
            : "border-white/20 hover:border-blue-400"
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
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-500"
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
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <svg
                className="h-12 w-12 text-gray-400"
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
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="font-medium text-blue-600 hover:text-blue-700">
                  Click to upload
                </span>
                <span className="text-gray-600"> or drag and drop</span>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                PDF files only (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      {selectedFile && (
        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={analyzeMutation.isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analyzeMutation.isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              "Analyze Bank Statement"
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {analyzeMutation.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Error: {analyzeMutation.error.message}
          </p>
        </div>
      )}
    </div>
  );
}
