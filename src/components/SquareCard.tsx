import React from "react";
import { Link } from "react-router-dom";

interface Props {
  to: string;
  label: string;
}

const SquareCard: React.FC<Props> = ({ to, label }) => (
  <Link
    to={to}
    className="flex aspect-square w-full items-center justify-center
               rounded-xl border border-gray-300 bg-white p-4 text-center
               text-sm font-medium shadow hover:bg-gray-50
               dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200
               dark:hover:bg-gray-700"
  >
    {label}
  </Link>
);

export default SquareCard;
