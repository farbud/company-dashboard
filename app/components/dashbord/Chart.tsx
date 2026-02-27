"use client";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useMemo } from "react";
import { Transaction } from "./Transactions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type ChartProps = {
  transactions: Transaction[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users?: any[];
};

export default function DashboardCharts({ transactions }: ChartProps) {
  const stats = useMemo(() => {
    const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    return [
      {
        label: "Revenue",
        value: `$${total.toLocaleString()}`,
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
      },
      {
        label: "Transactions",
        value: transactions.length,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
      },
      {
        label: "Average",
        value: `$${transactions.length > 0 ? (total / transactions.length).toFixed(0) : 0}`,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        label: "Active Users",
        value: new Set(transactions.map((t) => t.user)).size,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
      },
    ];
  }, [transactions]);

  // تنظیمات عمومی برای جلوگیری از بیرون زدگی
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 15, // ایجاد فاصله داخلی برای جلوگیری از برخورد با لبه‌ها
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: { color: "#9CA3AF", font: { size: 11 }, padding: 10 },
      },
    },
    scales: {
      y: {
        grid: { color: "rgba(156, 163, 175, 0.05)" },
        ticks: { color: "#6B7280" },
      },
      x: { grid: { display: false }, ticks: { color: "#6B7280" } },
    },
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      {/* Summary Cards - Fixed Revenue Overflow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`p-5 rounded-3xl border border-gray-700/50 ${stat.bg} backdrop-blur-sm min-w-0 overflow-hidden`}
          >
            <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 tracking-wider">
              {stat.label}
            </p>
            <p
              className={`font-black tracking-tighter break-all ${stat.color} text-lg sm:text-xl lg:text-2xl`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* All Charts Stacked Vertically */}
      <div className="flex flex-col gap-6 w-full">
        {/* Line Chart */}
        <div className="bg-gray-800/40 p-4 sm:p-6 rounded-3xl border border-gray-700 h-80 w-full relative">
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-widest">
            Live Monitoring
          </h3>
          <div className="h-55">
            <Line
              data={{
                labels: transactions
                  .slice(0, 10)
                  .reverse()
                  .map((t) => new Date(t.date).toLocaleTimeString("en-GB")),
                datasets: [
                  {
                    label: "Amount",
                    data: transactions.slice(0, 10).map((t) => t.amount),
                    borderColor: "#6366f1",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={commonOptions}
            />
          </div>
        </div>

        {/* Doughnut Chart - Fixed Box Overflow */}
        <div className="bg-gray-800/40 p-4 sm:p-6 rounded-3xl border border-gray-700 h-80 w-full relative">
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-widest text-center sm:text-left">
            Weekly Distribution
          </h3>
          <div className="h-70 flex justify-center">
            <Doughnut
              data={{
                labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                datasets: [
                  {
                    data: [12, 19, 3, 5, 2, 3, 9],
                    backgroundColor: [
                      "#F87171",
                      "#FB923C",
                      "#FBBF24",
                      "#34D399",
                      "#22D3EE",
                      "#818CF8",
                      "#C084FC",
                    ],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                ...commonOptions,
                maintainAspectRatio: true, // مهم: برای اینکه دایره دفرمه نشود
                scales: { x: { display: false }, y: { display: false } }, // حذف محورها در دایره‌ای
              }}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-800/40 p-4 sm:p-6 rounded-3xl border border-gray-700 h-80 w-full relative">
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-widest">
            Monthly Activity
          </h3>
          <div className="h-55">
            <Bar
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                datasets: [
                  {
                    label: "Transactions",
                    data: [65, 59, 80, 45, 90],
                    backgroundColor: "#6366f1",
                    borderRadius: 5,
                  },
                ],
              }}
              options={commonOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
