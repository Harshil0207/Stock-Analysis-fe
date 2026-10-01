import TransactionsPage from "../../../imports/Transactions/ui/pages/TransactionsPage.js";

export const metadata = {
  title: "Transactions Ledger - TRADESET Terminal",
  description: "View and inspect all active ledger audit entries, sandbox test transfers, and settlement records."
};

export default function Page() {
  return <TransactionsPage />;
}
