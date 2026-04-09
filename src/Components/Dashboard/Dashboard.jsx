import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler, // Required for the shaded area under the line
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

import PageHeader from '../Common/PageHeader';

export default function Dashboard() {
  // USER GROWTH: Configured to match your uploaded "div.png"
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Users',
        data: [1200, 1500, 1800, 2100, 2400, 2847], // Matching the upward trend in your image
        fill: true, // Enables the shading
        backgroundColor: 'rgba(37, 99, 235, 0.1)', // Light blue tint
        borderColor: '#2563EB', // Solid blue line
        borderWidth: 2,
        tension: 0, // CRITICAL: 0 makes the lines straight like your image
        pointRadius: 0, // Removes the dots to match your clean image style
        pointHoverRadius: 5,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: {
        min: 0,
        max: 3000,
        ticks: { stepSize: 500, color: '#9CA3AF' },
        grid: { color: '#F3F4F6' }, // Light grid lines
      },
      x: {
        grid: { display: false }, // Removes vertical grid lines like your image
        ticks: { color: '#9CA3AF' },
      },
    },
  };

  const pieData = {
    labels: ['Books', 'Audio', 'Others', 'Quizzes'],
    datasets: [
      {
        data: [60.6, 27.9, 7.13, 4.37],
        backgroundColor: ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B'],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, padding: 20 } },
    },
  };

  return (
    <div className="p-8 min-h-screen bg-[#F8F9FC] font-['Inter']">
      {/* STATS CARDS (Matching your Frame.jpg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value="2,847" trend="+12%" color="bg-blue-100" textColor="text-blue-600" />
        <StatCard title="Total Books" value="1,234" trend="+8%" color="bg-green-100" textColor="text-green-600" />
        <StatCard title="Audio Files" value="567" trend="+15%" color="bg-purple-100" textColor="text-purple-600" />
        <StatCard title="Active Quizzes" value="89" trend="+5%" color="bg-orange-100" textColor="text-orange-600" />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">User Growth</h3>
          <div className="h-72"><Line data={lineData} options={lineOptions} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">Content Distribution</h3>
          <div className="h-72"><Pie data={pieData} options={pieOptions} /></div>
        </div>
      </div>
    </div >
  );
}

function StatCard({ title, value, trend, color, textColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-800">{value}</h3>
        <p className="text-green-500 text-xs font-bold mt-2">{trend} <span className="text-gray-400 font-normal">from last month</span></p>
      </div>
      <div className={`${color} ${textColor} p-3 rounded-xl`}>
        {/* You can put Icons here later */}
        <div className="w-6 h-6 bg-current opacity-20 rounded shadow-inner" />
      </div>
    </div>
  );
}