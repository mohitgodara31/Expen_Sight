import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, change, isLoading }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    {isLoading ? (
      <div className="mt-2 h-8 w-16 bg-gray-200 rounded-md animate-pulse"></div>
    ) : (
      <p className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{value}</p>
    )}
    {change && !isLoading && <p className="text-sm text-gray-500 mt-1">{change}</p>}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalReceipts: 0, converted: 0, pending: 0, thisMonth: 0 });
  const [trends, setTrends] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // We fetch all data concurrently for performance
        const [statsRes, trendsRes, activityRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/trends'),
          api.get('/expense/', { params: { limit: 5 } }) // Correctly pass limit as a param
        ]);
        
        setStats(statsRes.data);
        setTrends(trendsRes.data.data);
        setRecentActivity(activityRes.data);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Could not load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Here's your expense management overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total expenses" value={stats.totalReceipts} change="All time" isLoading={isLoading} />
        <StatCard title="Converted" value={stats.converted} change="Successfully reconciled" isLoading={isLoading} />
        <StatCard title="Pending" value={stats.pending} change="Needs reconciliation" isLoading={isLoading} />
        <StatCard title="This Month" value={stats.thisMonth} change="New Expenses" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-900">Expense Trends</h3>
            <p className="text-sm text-gray-500">Your spending patterns over the last 6 months.</p>
            <div className="h-80 mt-4">
              <hr></hr>
              {/* {isLoading ? (
                <div className="h-full w-full bg-gray-200 rounded-md animate-pulse"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'rgba(243, 244, 246, 0.5)'}} contentStyle={{borderRadius: '0.5rem', border: '1px solid #e5e7eb'}}/>
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )} */}
            </div>
        </div>
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-500 mt-1">Your 5 most recent expenses.</p>
                <ul className="mt-4 space-y-3">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-2/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      </li>
                    ))
                  ) : recentActivity.length > 0 ? (
                    recentActivity.slice(0,5).map(exp => (
                      <li key={exp.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{exp.category}</span>
                        <span className="font-semibold text-gray-900">{exp.amount.toFixed(2)} {exp.currency}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 pt-4">No recent activity.</p>
                  )}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;