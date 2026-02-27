"use client";
import { useEffect, useState } from "react";
import Skeleton from "../ui/Skeleton";

export type User = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  setUsers?: (data: User[]) => void;
};

function generateFakeUsers() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));
}

export default function UsersList({ setUsers }: Props) {
  const [usersLocal, setUsersLocal] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const itemsPerPage = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      const fakeData = generateFakeUsers();
      setUsersLocal(fakeData);
      if (setUsers) setUsers(fakeData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = usersLocal.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedData = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
      <h2 className="font-bold mb-2">Users List</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
      />
      {loading
        ? Array.from({ length: itemsPerPage }).map((_, i) => (
            <Skeleton key={i} className="h-6 mb-2" />
          ))
        : paginatedData.map((u) => (
            <div
              key={u.id}
              className="flex justify-between mb-1 p-2 rounded bg-gray-100 dark:bg-gray-600"
            >
              <span>{u.name}</span>
              <span>{u.email}</span>
            </div>
          ))}
      {!loading && filteredUsers.length === 0 && <p>No users found.</p>}
      {!loading && filteredUsers.length > 0 && (
        <div className="flex justify-between mt-2">
          <button
            className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
