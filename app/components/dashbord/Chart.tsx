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

export default function DashboardCharts({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const stats = useMemo(() => {
    const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const avg =
      transactions.length > 0 ? (total / transactions.length).toFixed(0) : 0;
    const uniqueUsers = new Set(transactions.map((t) => t.user)).size;

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
        value: `$${avg}`,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        label: "Active Users",
        value: uniqueUsers,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
      },
    ];
  }, [transactions]);

  const lineData = useMemo(() => {
    const lastTen = [...transactions].slice(0, 10).reverse();
    return {
      labels: lastTen.map((t) =>
        new Date(t.date).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      ),
      datasets: [
        {
          label: "Live Amount ($)",
          data: lastTen.map((t) => t.amount),
          borderColor: "#6366f1",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)");
            gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
            return gradient;
          },
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#fff",
        },
      ],
    };
  }, [transactions]);

  const doughnutData = useMemo(() => {
    const counts = new Array(7).fill(0);
    transactions.forEach((t) => counts[new Date(t.date).getDay()]++);
    return {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          data: counts,
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
    };
  }, [transactions]);

  const barData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const counts = new Array(12).fill(0);
    transactions.forEach((t) => counts[new Date(t.date).getMonth()]++);
    return {
      labels: months,
      datasets: [
        {
          label: "Transactions",
          data: counts,
          backgroundColor: "#6366f1",
          borderRadius: 8,
        },
      ],
    };
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#9CA3AF", font: { size: 12 } } },
    },
    scales: {
      y: {
        grid: { color: "rgba(156, 163, 175, 0.05)" },
        ticks: { color: "#6B7280" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", maxRotation: 45, minRotation: 45 },
      },
    },
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      {/* Summary Cards - Responsive font and layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`p-5 rounded-3xl border border-gray-700/50 ${stat.bg} backdrop-blur-sm`}
          >
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            {/* حل مشکل بیرون‌زدگی عدد: استفاده از break-words و کوچک‌تر شدن فونت در موبایل */}
            <p
              className={`text-xl sm:text-2xl font-black ${stat.color} break-words`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* All Charts Stacked Vertically */}
      <div className="flex flex-col gap-6 w-full">
        {/* Line Chart */}
        <div className="bg-gray-800/40 p-4 sm:p-6 rounded-3xl border border-gray-700 shadow-xl h-80 w-full">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
            Live Monitoring
          </h3>
          <div className="h-full w-full">
            <Line data={lineData} options={options} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-gray-800/40 p-4 sm:p-6 rounded-3xl border border-gray-700 shadow-xl h-80 w-full">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
            Weekly Distribution
          </h3>
          <div className="h-full w-full">
            <Doughnut
              data={doughnutData}
              options={{ ...options, scales: {} }}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-800/40 p-4 sm:p-6 rounded-3xl border border-gray-700 shadow-xl h-80 w-full">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
            Monthly Activity
          </h3>
          <div className="h-full w-full">
            <Bar data={barData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
