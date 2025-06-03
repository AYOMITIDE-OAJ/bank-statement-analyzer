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
- Tailwind CSS
- PDF.js / pdf-parse / Anthropic API

## 🧑‍💻 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/bank-statement-analyzer.git
cd bank-statement-analyzer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📄 Test Document

A sample bank statement is included in the project for testing purposes:

- Location: `/public/repaired_bank_statement.pdf`
- Use this document to test the application's parsing capabilities
