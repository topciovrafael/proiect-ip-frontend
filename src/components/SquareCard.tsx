import type React from "react";
import { Link } from "react-router-dom";

interface SquareCardProps {
  to: string;
  label: string;
}

const SquareCard: React.FC<SquareCardProps> = ({ to, label }) => {
  return (
    <Link
      to={to}
      className="flex h-40 w-full items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
    >
      <span className="whitespace-pre-line text-lg font-medium text-gray-700">
        {label}
      </span>
    </Link>
  );
};

export default SquareCard;
