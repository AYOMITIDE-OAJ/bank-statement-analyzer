import PDFParse from "pdf-parse";
import { Anthropic } from "@anthropic-ai/sdk";
import type { BankStatementData, Transaction } from "~/types/bank-statement";

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
    console.error("PDF parse error:", error);
    return {
      accountHolderName: "N/A",
      accountHolderAddress: "N/A",
      documentDate: "N/A",
      startingBalance: 0,
      endingBalance: 0,
      transactions: [],
      calculatedBalance: 0,
      balanceDifference: 0,
      isReconciled: false,
    };
  }

  const prompt = `
You are a financial analysis assistant. Analyze the following bank statement text and extract:

- accountHolderName
- accountHolderAddress
- documentDate (the statement date)
- startingBalance (number)
- endingBalance (number)
- A list of transactions with:
  - date (format: YYYY-MM-DD)
  - description
  - amount (positive number)
  - type ("credit" or "debit")

Return a valid JSON object in the following format:

{
  "accountHolderName": "...",
  "accountHolderAddress": "...",
  "documentDate": "...",
  "startingBalance": 0,
  "endingBalance": 0,
  "transactions": [
    {
      "date": "...",
      "description": "...",
      "amount": 0,
      "type": "credit"
    }
  ]
}

Bank statement text:
"""
${extractedText}
"""
`;

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    });

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

    const responseText = completion.content.find(
      (block) => block.type === "text",
    ) as { type: "text"; text: string };

    const jsonMatch = /\{[\s\S]*\}/.exec(responseText.text);
    if (!jsonMatch) {
      throw new Error("Claude response does not contain valid JSON.");
    }

    let parsedData: BankStatementData;
    try {
      parsedData = JSON.parse(jsonMatch[0]) as BankStatementData;
    } catch (err) {
      console.error("JSON parsing failed:", err);
      throw new Error("Failed to parse JSON from Claude output.");
    }

    const calculatedBalance = calculateBalanceFromTransactions(
      parsedData.startingBalance,
      parsedData.transactions,
    );

    const balanceDifference = Math.abs(
      calculatedBalance - parsedData.endingBalance,
    );
    const isReconciled = balanceDifference < 0.01;

    return {
      ...parsedData,
      calculatedBalance,
      balanceDifference,
      isReconciled,
    };
  } catch (error) {
    console.error("Claude error or JSON parse error:", error);
    throw new Error("Failed to analyze bank statement with Claude.");
  }
}

export function calculateBalanceFromTransactions(
  startingBalance: number,
  transactions: Transaction[],
): number {
  return transactions.reduce((balance, txn) => {
    return txn.type === "credit" ? balance + txn.amount : balance - txn.amount;
  }, startingBalance);
}
