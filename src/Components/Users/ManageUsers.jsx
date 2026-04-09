import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import axios from 'axios';

export default function ManageUsers() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://book-bridge-sage.vercel.app/api/users/1');
        // Currently the endpoint returns a single user. Wrapping in array so the table maps properly.
        if (response.data && response.data.userData) {
          setUsers([response.data.userData]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="font-sans relative">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Users</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">View and manage all registered users</p>
        </div>
        {/* Click to open modal */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> Add User
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Search size={18} /></span>
            <input type="text" placeholder="Search by name..." className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Filter size={18} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">ID</th>
                <th className="px-8 py-5">First Name</th>
                <th className="px-8 py-5">Last Name</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Image</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50/30 transition">
                  <td className="px-8 py-5 text-sm font-bold text-gray-900">#{user.user_id}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-900">{user.firstname}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-900">{user.lastname}</td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-500">{user.email}</td>
                  <td className="px-8 py-5"><img src={user.profile_image} className="w-10 h-10 rounded-full border-2 border-white shadow-md" alt="" /></td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2 justify-center">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700">Edit</button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD USER MODAL PANEL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Black background overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>

          {/* User Information Panel */}
          <div className="relative bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">User Information</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">First Name</label>
                  <input type="text" placeholder="Enter First name" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Last Name</label>
                  <input type="text" placeholder="Enter Last name" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email</label>
                <input type="email" placeholder="Enter email" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Image</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <label className="bg-gray-100 px-4 py-2.5 text-sm font-medium border-r border-gray-200 cursor-pointer hover:bg-gray-200 transition">
                    Choose File
                    <input type="file" className="hidden" />
                  </label>
                  <span className="px-4 text-sm text-gray-400">No file chosen</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <input type="password" placeholder="Enter password" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition" />
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}