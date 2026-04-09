import React, { useState } from 'react';
import { ChevronDown, Trash2, Book, ChevronLeft, ChevronRight } from 'lucide-react';

import PageHeader from '../Common/PageHeader';

export default function ManageBooks() {
  // Sample data matching your screenshot requirements
  const [books, setUsers] = useState([
    { id: '#1001', userId: 'USR-2847', title: 'The Great Adventure', category: 'Fiction', path: '/books/great-adventure.pdf', color: 'bg-blue-100 text-blue-600' },
    { id: '#1002', userId: 'USR-3921', title: 'Science of Tomorrow', category: 'Science', path: '/books/science-tomorrow.pdf', color: 'bg-green-100 text-green-600' },
    { id: '#1003', userId: 'USR-1562', title: 'Digital Marketing', category: 'Business', path: '/books/marketing-guide.pdf', color: 'bg-purple-100 text-purple-600' },
    { id: '#1004', userId: 'USR-4783', title: 'History of Ancient Rome', category: 'History', path: '/books/ancient-rome.pdf', color: 'bg-orange-100 text-orange-600' },
    { id: '#1005', userId: 'USR-2847', title: 'Cooking Masterclass', category: 'Lifestyle', path: '/books/cooking.pdf', color: 'bg-pink-100 text-pink-600' },
    { id: '#1006', userId: 'USR-9204', title: 'Modern Architecture', category: 'Design', path: '/books/architecture.pdf', color: 'bg-indigo-100 text-indigo-600' },
  ]);

  const deleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setUsers(books.filter(book => book.id !== id));
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#F8F9FC] font-['Inter']">
      <div>
        <PageHeader
          title="Manage Books"
          subtitle="View and manage all books in the system"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

        {/* Toolbar */}
        <div className="p-6 flex justify-between items-center border-b border-gray-50 bg-white">
          <div className="flex gap-3">
            <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/10 transition">
              <option>All Categories</option>
              <option>Fiction</option>
              <option>Science</option>
            </select>
            <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/10 transition">
              <option>Sort by Date</option>
              <option>Newest First</option>
            </select>
          </div>
          <div className="text-sm font-bold text-gray-400">
            Showing <span className="text-gray-900">1-6</span> of {books.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FC] border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">ID</th>
                <th className="px-8 py-5">User ID</th>
                <th className="px-8 py-5">Title</th>
                <th className="px-8 py-5">File Path</th>
                <th className="px-8 py-5 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6 text-sm font-black text-gray-800">{book.id}</td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-400">{book.userId}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {/* Dynamic Colored Icon Box */}
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${book.color} shadow-sm group-hover:scale-110 transition-transform`}>
                        <Book size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{book.title}</p>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{book.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[13px] font-medium text-gray-400 font-mono italic bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      {book.path}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Simple Pagination Footer */}
        <div className="p-6 bg-[#F8F9FC] flex justify-end items-center gap-4 border-t border-gray-100">
          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 transition"><ChevronLeft size={20} /></button>
          <button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold shadow-lg shadow-blue-100">1</button>
          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 transition"><ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
  );
}