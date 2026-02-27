"use client";
import Sidebar from "@/app/components/dashbord/Siderbar";
import Notifications from "@/app/components/dashbord/Notifications";
import Transactions, {
  Transaction,
} from "@/app/components/dashbord/Transactions";
import UsersList, { User } from "@/app/components/dashbord/UserList";
import Chart from "@/app/components/dashbord/Chart";
import DarkModeToggle from "@/app/components/ui/DarkModeToggle";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "@/app/store/index";
import { useState } from "react";

export default function DashboardPage() {
  // Dark mode state can also come from Redux if preferred
  const [darkMode, setDarkMode] = useState(false);

  // Shared state for Chart
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  return (
    <Provider store={store}>
      <div
        className={
          darkMode
            ? "dark bg-gray-900 text-white min-h-screen"
            : "bg-gray-100 text-gray-900 min-h-screen"
        }
      >
        <div className="flex flex-col md:flex-row">
          {/* Sidebar سمت راست */}
          <div className="order-2 md:order-1 w-full md:w-64 bg-gray-200 dark:bg-gray-500 p-4">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 order-1 md:order-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <DarkModeToggle
                value={darkMode}
                onToggle={() => setDarkMode(!darkMode)}
              />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Chart وسط */}
              <div className="col-span-2 bg-white dark:bg-gray-700 p-4 rounded shadow">
                <Chart transactions={transactions} users={users} />
              </div>

              {/* سمت چپ */}
              <div className="space-y-4">
                <Transactions setTransactions={setTransactions} />
                <UsersList setUsers={setUsers} />
                <Notifications />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
}
