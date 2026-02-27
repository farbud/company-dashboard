"use client";
import { useEffect, useState } from "react";

export type Transaction = {
  id: number;
  user: string;
  amount: number;
  date: string;
};

type Props = { setTransactions?: (data: Transaction[]) => void };

function generateInitialData(): Transaction[] {
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

export default function Transactions({ setTransactions }: Props) {
  // رفع خطا: مقداردهی اولیه مستقیم به جای useEffect
  const [transactionsLocal, setTransactionsLocal] = useState<Transaction[]>(
    () => {
      const data = generateInitialData();
      return data;
    },
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // همگام‌سازی با والد در اولین رندر
  useEffect(() => {
    setTransactions?.(transactionsLocal);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransactionsLocal((prev) => {
        const nextId =
          prev.length > 0 ? Math.max(...prev.map((t) => t.id)) + 1 : 1;
        const newTx = {
          id: nextId,
          user: `User ${Math.floor(Math.random() * 20) + 1}`,
          amount: Math.floor(Math.random() * 1000),
          date: new Date().toISOString(),
        };
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
    <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-3xl border border-gray-700 shadow-xl  flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-white tracking-tight">
        Live Transactions
      </h2>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full p-3 mb-6 rounded-2xl bg-gray-900/50 border border-gray-700 text-gray-200 outline-none"
      />
      <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {paginated.map((t) => (
          <div
            key={t.id}
            className="flex justify-between items-center p-4 rounded-2xl bg-gray-800/50 border border-gray-700/30"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-gray-200 text-sm">
                {t.user}
              </span>
              <span className="text-[10px] text-gray-500">
                {new Date(t.date).toLocaleTimeString("en-GB")}
              </span>
            </div>
            <span className="font-bold text-emerald-400 text-lg">
              ${t.amount}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700/50">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-700/50 rounded-xl disabled:opacity-20 text-xs text-white"
        >
          PREV
        </button>
        <span className="text-gray-500 text-[10px]">
          PAGE {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-700/50 rounded-xl disabled:opacity-20 text-xs text-white"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
