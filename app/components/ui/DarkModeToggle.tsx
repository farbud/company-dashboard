"use client";
import React from "react";

type DarkModeToggleProps = {
  value: boolean;
  onToggle: () => void;
};

export default function DarkModeToggle({
  value,
  onToggle,
}: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
    >
      {value ? "🌞" : "🌙"}
    </button>
  );
}
