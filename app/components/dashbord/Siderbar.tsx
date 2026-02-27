"use client";
import {
  FaHome,
  FaUsers,
  FaChartBar,
  FaBell,
  FaCreditCard,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <nav className="space-y-4 fixed">
      <ul>
        <li className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
          <FaHome /> Home
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
          <FaUsers /> Users
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
          <FaChartBar /> Chart
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
          <FaBell /> Notifications
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
          <FaCreditCard /> Transactions
        </li>
      </ul>
    </nav>
  );
}
