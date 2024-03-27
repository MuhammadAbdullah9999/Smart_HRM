// src/components/Dashboard/DashboardStat.jsx
import React from "react";

function DashboardStat({ label, value }) {
  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <p className="text-lg font-semibold mb-2">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}

export default DashboardStat;
