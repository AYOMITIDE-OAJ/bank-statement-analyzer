import PDFParse from "pdf-parse";
import Anthropic from "@anthropic-ai/sdk";
import type { BankStatementData, Transaction } from "~/types/bank-statement";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
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
    console.error("PDF parse error:", error);
    throw new Error("Failed to extract text from PDF.");
  }

  const jsonExample = `{
  "accountHolderName": "example",
  "accountHolderAddress": "example",
  "documentDate": null,
  "startingBalance": 0,
  "endingBalance": 0,
  "transactions": [{
    "id": "example",
    "date": "example",
    "description": "example",
    "amount": 0,
    "type": "credit",
    "balance": null
  }]
}`;

  const prompt = `
You are a precise bank statement analyzer that responds only with valid JSON. If you cannot extract the information, return a valid JSON object with empty values.

Analyze the following bank statement text and extract:

Here is an example of the JSON format you should return:

${jsonExample}

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

    const textBlock = completion.content.find(
      (block) => block.type === "text",
    ) as { type: "text"; text: string } | undefined;

    if (!textBlock) {
      throw new Error("Claude returned no usable text");
    }

    let parsedData: BankStatementData;
    try {
      parsedData = JSON.parse(textBlock.text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      parsedData = {
        accountHolderName: "N/A",
        accountHolderAddress: "N/A",
        documentDate: null,
        startingBalance: 0,
        endingBalance: 0,
        transactions: [],
        calculatedBalance: 0,
        isReconciled: false,
        balanceDifference: 0,
      };
    }

    const calculatedBalance = calculateBalanceFromTransactions(
      parsedData.startingBalance,
      parsedData.transactions,
    );

    const balanceDifference = Math.abs(
      calculatedBalance - parsedData.endingBalance,
    );

    return {
      ...parsedData,
      calculatedBalance,
      isReconciled: balanceDifference < 0.01,
      balanceDifference,
    };
  } catch (error: any) {
    console.error("Claude processing error:", error);
    throw new Error(
      `Failed to analyze bank statement: ${error.message || "Unknown"}`,
    );
  }
}

function calculateBalanceFromTransactions(
  startingBalance: number,
  transactions: Transaction[],
): number {
  return transactions.reduce((acc, txn) => {
    return txn.type === "credit" ? acc + txn.amount : acc - txn.amount;
  }, startingBalance);
}
