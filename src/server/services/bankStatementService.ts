import PDFParse from "pdf-parse";
import Anthropic from "@anthropic-ai/sdk";
import type { BankStatementData, Transaction } from "~/types/bank-statement";
import * as fs from "fs";

const anthropic = new Anthropic({
  apiKey: process.env.OPENAI_API_KEY, // Using OPENAI_API_KEY for Anthropic
});

export async function analyzeBankStatement(
  pdfBuffer: Buffer,
): Promise<BankStatementData> {
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error("Invalid PDF buffer: PDF buffer is empty or null");
  }

  let extractedText: string;
  try {
    const pdfData = await PDFParse(pdfBuffer);
    extractedText = pdfData.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF.");
  }

  const prompt = `
You are a precise bank statement analyzer that responds only with valid JSON.

Analyze the following bank statement text and extract the required information:

Return:
{
  "accountHolderName": string,
  "accountHolderAddress": string,
  "documentDate": string | null,
  "startingBalance": number,
  "endingBalance": number,
  "transactions": [{
    "id": string,
    "date": string,
    "description": string,
    "amount": number,
    "type": "credit" | "debit",
    "balance": number | null
  }]
}

Bank statement text:
${extractedText}
`;

  try {
    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Parse the response correctly by checking block type
    const textBlock = completion.content.find(
      (block) => block.type === "text",
    ) as { type: "text"; text: string } | undefined;

    if (!textBlock) {
      throw new Error("No valid text block found in Claude response");
    }

    const responseText = textBlock.text;
    const parsedData = JSON.parse(responseText);

    const calculatedBalance = calculateBalanceFromTransactions(
      parsedData.startingBalance,
      parsedData.transactions,
    );

    const balanceDifference = Math.abs(
      calculatedBalance - parsedData.endingBalance,
    );
    const isReconciled = balanceDifference < 0.01;

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
      `Failed to analyze bank statement: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

function calculateBalanceFromTransactions(
  startingBalance: number,
  transactions: Transaction[],
): number {
  return transactions.reduce(
    (balance, txn) => balance + txn.amount,
    startingBalance,
  );
}

export function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
