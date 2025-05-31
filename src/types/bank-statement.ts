export interface AnalysisResult {
  success: boolean;
  data?: BankStatementData;
  error?: string;
  processingTime: number;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  balance?: number;
}

export interface BankStatementData {
  accountHolderName: string;
  accountHolderAddress: string;
  documentDate: string | null;
  startingBalance: number;
  endingBalance: number;
  transactions: Transaction[];
  calculatedBalance: number;
  isReconciled: boolean;
  balanceDifference: number;
}
