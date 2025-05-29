import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { analyzeBankStatement } from "../../services/bankStatementService";
import type { BankStatementData } from "~/types/bank-statement";

export const bankStatementRouter = createTRPCRouter({
  analyze: publicProcedure
    .input(
      z.object({
        fileContent: z.string(), // Base64 encoded PDF content
        fileName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const startTime = Date.now();

      try {
        // Convert base64 to buffer
        const pdfBuffer = Buffer.from(input.fileContent, "base64");

        // Analyze the PDF
        const analysisResult = await analyzeBankStatement(pdfBuffer);

        const processingTime = Date.now() - startTime;

        return {
          success: true,
          data: analysisResult,
          processingTime,
        };
      } catch (error) {
        const processingTime = Date.now() - startTime;

        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
          processingTime,
        };
      }
    }),

  // Optional: Get analysis history (if you want to store results)
  getHistory: publicProcedure.query(() => {
    // This would typically fetch from a database
    // For MVP, we'll return empty array
    return [];
  }),
});
