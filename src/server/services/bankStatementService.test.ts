import { calculateBalanceFromTransactions } from "./bankStatementService";
import type { Transaction } from "~/types/bank-statement";

describe("calculateBalanceFromTransactions", () => {
  it("should calculate the balance correctly with credits and debits", () => {
    const startingBalance = 100;
    const transactions: Transaction[] = [
      {
        id: "1",
        date: "2024-01-01",
        description: "Credit",
        amount: 50,
        type: "credit",
      },
      {
        id: "2",
        date: "2024-01-02",
        description: "Debit",
        amount: 20,
        type: "debit",
      },
      {
        id: "3",
        date: "2024-01-03",
        description: "Credit",
        amount: 30,
        type: "credit",
      },
    ];
    const expectedBalance = 160;
    const actualBalance = calculateBalanceFromTransactions(
      startingBalance,
      transactions,
    );
    expect(actualBalance).toBe(expectedBalance);
  });

  it("should return the starting balance when there are no transactions", () => {
    const startingBalance = 100;
    const transactions: Transaction[] = [];
    const expectedBalance = 100;
    const actualBalance = calculateBalanceFromTransactions(
      startingBalance,
      transactions,
    );
    expect(actualBalance).toBe(expectedBalance);
  });
});
