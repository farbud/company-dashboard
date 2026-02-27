"use client";

import { useEffect, useState } from "react";
import Skeleton from "../ui/Skeleton";

export type Transaction = {
  id: number;
  user: string;
  amount: number;
  date: string;
};

type Props = { setTransactions?: (data: Transaction[]) => void };

function generateInitialData() {
  const transactions: Transaction[] = [];
  const now = new Date();
  for (let i = 0; i < 40; i++) {
    const pastTime = new Date(now.getTime() - i * 60000);
    transactions.push({
      id: i + 1,
      user: `User ${Math.floor(Math.random() * 20) + 1}`,
      amount: Math.floor(Math.random() * 1000),
      date: pastTime.toISOString(),
    });
  }
  return transactions;
}

function generateNewTransaction(nextId: number) {
  return {
    id: nextId,
    user: `User ${Math.floor(Math.random() * 20) + 1}`,
    amount: Math.floor(Math.random() * 1000),
    date: new Date().toISOString(),
  };
}

export default function Transactions({ setTransactions }: Props) {
  const [transactionsLocal, setTransactionsLocal] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    const initialData = generateInitialData();

    setTransactions?.(initialData);

    const interval = setInterval(() => {
      setTransactionsLocal((prev) => {
        const nextId =
          prev.length > 0 ? Math.max(...prev.map((t) => t.id)) + 1 : 1;
        const newTx = generateNewTransaction(nextId);
        const updated = [newTx, ...prev];
        setTransactions?.(updated);
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [setTransactions]);

  const filtered = transactionsLocal.filter((t) =>
    t.user.toLowerCase().includes(search.toLowerCase()),
  );
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 ">
      <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">
        Recent Transactions
      </h2>
      <input
        type="text"
        placeholder="Search user..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full p-3 mb-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-200"
      />

      <div className="space-y-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))
          : paginated.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                    {t.user}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {new Date(t.date).toLocaleTimeString("en-GB")}
                  </span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ${t.amount}
                </span>
              </div>
            ))}
      </div>

      {!loading && filtered.length > 0 && (
        <div className="flex justify-between items-center mt-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
