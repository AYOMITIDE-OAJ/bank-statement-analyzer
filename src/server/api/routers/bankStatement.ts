import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { analyzeBankStatement } from "../../services/bankStatementService";

export const bankStatementRouter = createTRPCRouter({
  analyze: publicProcedure
    .input(
      z.object({
        fileContent: z.string(), // base64-encoded PDF
        fileName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const pdfBuffer = Buffer.from(input.fileContent, "base64");

        // Analyze the bank statement PDF
        let result;
        try {
          result = await analyzeBankStatement(pdfBuffer);
        } catch (err) {
          console.error("Error analyzing bank statement:", err);
          result = {
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

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        return {
          success: false,
          error: "An unexpected error occurred during bank statement analysis.",
        };
      }
    }),
});
