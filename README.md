# Bank Statement Analyzer

A full-stack TypeScript application that allows analysts to upload PDF bank statements and extract key data, including:

- Account holder name and address
- Document date
- Starting and ending balances
- List of transactions
- Validation of transactions vs balance delta

## 🚀 Features

- PDF upload (client-side)
- Extraction and parsing of key data from PDFs using AI or text heuristics
- Validates transaction sum against balance difference
- Minimal and clean UI
- Built with [Next.js](https://nextjs.org/) 

## 🛠️ Tech Stack

- TypeScript
- Next.js 
- Tailwind CSS (optional for UI)
- PDF.js / pdf-parse / Anthropic API

## 🧑‍💻 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/bank-statement-analyzer.git
cd bank-statement-analyzer     
