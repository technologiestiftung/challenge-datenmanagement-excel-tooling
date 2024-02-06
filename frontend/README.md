This is a simple frontend that displays real time changes of a supabase database in a table.
Users need to log in with a Microsoft account before they'll be shown the data.
The Auth-Flow is handled by supabase, it uses OAuth2 with Azure as provider.
After logging in, the data can also be downloaded as Excel file.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy the `.env.sample` file and fill it out with your supabase credentials:
```bash
cp .env.sample .env
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.