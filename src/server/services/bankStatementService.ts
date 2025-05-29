import PDFParse from "pdf-parse";
import OpenAI from "openai";
import type { BankStatementData, Transaction } from "~/types/bank-statement";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBankStatement(
  pdfBuffer: Buffer,
): Promise<BankStatementData> {
  // Step 1: Extract text from PDF
  const pdfData = await PDFParse(pdfBuffer);
  const extractedText = pdfData.text;

  // Step 2: Use OpenAI to analyze the text
  const analysisPrompt = `
You are a bank statement analyzer. Analyze the following bank statement text and extract the required information.

Please respond with a JSON object containing:
1. accountHolderName: string (the name of the account holder)
2. accountHolderAddress: string (the address of the account holder)
3. documentDate: string | null (the statement date, format as YYYY-MM-DD if found)
4. startingBalance: number (opening balance)
5. endingBalance: number (closing balance)
6. transactions: array of objects with:
   - id: string (generate a unique ID)
   - date: string (YYYY-MM-DD format)
   - description: string
   - amount: number (positive for credits, negative for debits)
   - type: "credit" | "debit"
   - balance: number (running balance if available)

Bank statement text:
${extractedText}

Important notes:
- Extract ALL transactions visible in the statement
- Ensure amounts are correctly signed (negative for debits/withdrawals, positive for credits/deposits)
- If balance information is not clear, set balance to null for individual transactions
- Be precise with numbers and dates
- If information is not found, use null for strings and 0 for numbers

Respond only with valid JSON, no additional text.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a precise bank statement analyzer that returns only valid JSON.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const parsedData = JSON.parse(responseText) as {
      accountHolderName: string;
      accountHolderAddress: string;
      documentDate: string | null;
      startingBalance: number;
      endingBalance: number;
      transactions: Transaction[];
    };

    // Step 3: Validate and reconcile the data
    const calculatedBalance = calculateBalanceFromTransactions(
      parsedData.startingBalance,
      parsedData.transactions,
    );

    const balanceDifference = Math.abs(
      calculatedBalance - parsedData.endingBalance,
    );
    const isReconciled = balanceDifference < 0.01; // Allow for small rounding differences

    const result: BankStatementData = {
      ...parsedData,
      calculatedBalance,
      isReconciled,
      balanceDifference,
    };

    return result;
  } catch (error) {
    console.error("Error analyzing bank statement:", error);
    throw new Error(
      `Failed to analyze bank statement: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

function calculateBalanceFromTransactions(
  startingBalance: number,
  transactions: Transaction[],
): number {
  return transactions.reduce((balance, transaction) => {
    return balance + transaction.amount;
  }, startingBalance);
}

// Utility function to generate unique IDs for transactions
export function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
