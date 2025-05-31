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
        const result = await analyzeBankStatement(pdfBuffer);

        return {
          success: true,
          data: result,
        };
      } catch (err) {
        console.error("Error analyzing bank statement:", err);

        return {
          success: false,
          error: `Failed to analyze bank statement: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
        };
      }
    }),
});
