"use client";

import { useEffect, useState } from "react";
import Skeleton from "../ui/Skeleton";

type Notification = {
  id: number;
  message: string;
  read: boolean;
  date: string;
};

function generateFakeNotifications(): Notification[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    message: `Notification ${i + 1}`,
    read: Math.random() > 0.5,
    date: `2026-02-${((i % 30) + 1).toString().padStart(2, "0")}`,
  }));
}

function generateNewNotification(nextId: number): Notification {
  const day = Math.floor(Math.random() * 30) + 1;
  return {
    id: nextId,
    message: `Notification ${nextId}`,
    read: false,
    date: `2026-02-${day.toString().padStart(2, "0")}`,
  };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setTimeout(() => {
      const initialData = generateFakeNotifications();
      setNotifications(initialData);
      setLoading(false);
    }, 1000);

    const interval = setInterval(() => {
      setNotifications((prev) => [
        generateNewNotification(prev.length + 1),
        ...prev,
      ]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const paginated = notifications.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
      <h2 className="font-bold mb-2">Notifications</h2>
      {loading
        ? Array.from({ length: itemsPerPage }).map((_, i) => (
            <Skeleton key={i} className="h-6 mb-2" />
          ))
        : paginated.map((n) => (
            <div
              key={n.id}
              className={`p-2 rounded mb-1 ${n.read ? "bg-gray-100 dark:bg-gray-600" : "bg-blue-100 dark:bg-blue-800"}`}
            >
              {n.message}
            </div>
          ))}
      {!loading && (
        <div className="flex justify-between mt-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            {page}/{totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
