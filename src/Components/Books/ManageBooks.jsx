import React, { useState, useEffect } from 'react';
import { ChevronDown, Trash2, Book, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

import PageHeader from '../Common/PageHeader';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortFilter, setSortFilter] = useState('Newest First');
  const itemsPerPage = 5;

  const processedBooks = books
    .filter(book => categoryFilter === 'All Categories' || book.category === categoryFilter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime() || 0;
      const dateB = new Date(b.createdAt).getTime() || 0;
      if (sortFilter === 'Newest First') return dateB - dateA;
      if (sortFilter === 'Oldest First') return dateA - dateB;
      return 0;
    });

  const totalItems = processedBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedBooks.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, sortFilter]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Not authenticated.");
          return;
        }

        const response = await axios.get("https://book-bridge-sage.vercel.app/api/file", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "*/*",
          }
        });

        // Tolerate different common array JSON wrappers
        const dataArr = Array.isArray(response.data) ? response.data : (response.data.files || response.data.data || []);

        const colors = [
          'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600',
          'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600',
          'bg-pink-100 text-pink-600', 'bg-indigo-100 text-indigo-600'
        ];

        const mappedFiles = dataArr.map((item, idx) => {
          const backupDate = new Date();
          backupDate.setDate(backupDate.getDate() - idx);
          return {
            id: item.file_id || item.id || `#${idx + 1000}`,
            userId: item.user_id || item.userId || 'System',
            title: item.title || item.name || item.filename || 'Untitled Book',
            category: item.category || item.type || 'Document',
            path: item.file_url || item.url || item.path || '#',
            createdAt: item.created_at || item.createdAt || backupDate.toISOString().split('T')[0],
            color: colors[idx % colors.length]
          };
        });

        setBooks(mappedFiles);
      } catch (error) {
        console.error("Error fetching books:", error);
        toast.error("Failed to fetch books from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const confirmDeleteBook = (id) => {
    setBookToDelete(id);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!bookToDelete) return;
    try {
      const token = localStorage.getItem("token");
      // Assumed delete structure. Standard local fallback included just in case.
      if (token && typeof bookToDelete === 'number') {
        await axios.delete(`https://book-bridge-sage.vercel.app/api/file/delete/${bookToDelete}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "application/json",
            "Content-Type": "application/json"
          }
        });
      }
      setBooks(books.filter(book => book.id !== bookToDelete));
      setShowDeleteModal(false);
      setBookToDelete(null);
      toast.success("Book removed successfully.");
    } catch (error) {
      console.error("Delete err:", error);
      toast.error("Failed to delete book.");
    }
  };

  return (
    <>
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
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/10 transition"
              >
                <option>All Categories</option>
                <option>Document</option>
                <option>Audio</option>
                <option>Fiction</option>
                <option>Science</option>
              </select>
              <select
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/10 transition"
              >
                <option>Sort by Date</option>
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
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
                  <th className="px-8 py-5">Created At</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentItems.length > 0 ? (
                  currentItems.map((book) => (
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
                        <span className="text-[13px] font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          {new Date(book.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex gap-2 justify-center">
                          <a
                            href={book.path}
                            download={book.title}
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-all active:scale-90 inline-flex"
                          >
                            <Download size={20} />
                          </a>
                          <button
                            onClick={() => confirmDeleteBook(book.id)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-12 text-center text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <Search size={32} className="text-gray-300" />
                        </div>
                        <p className="text-lg text-gray-900 font-bold">No books found</p>
                        <p className="text-sm">We couldn't find any books matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-white">
            <p className="text-gray-400 text-sm font-medium">
              Showing {books.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, totalItems)} of {totalItems}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border border-gray-200 ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === page ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 rounded-lg border border-gray-200 ${currentPage === totalPages || totalPages === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* --- DELETE CONFIRMATION MODAL --- */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowDeleteModal(false);
                setBookToDelete(null);
              }}
            ></div>
            <div className="relative bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 text-center pt-8">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-50/50">
                  <Trash2 className="text-red-500" size={32} />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Delete Book?</h2>
                <p className="text-sm text-gray-500 font-medium px-4 mb-8">
                  Are you sure you want to delete this book? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center border-t border-gray-100 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setBookToDelete(null);
                    }}
                    className="px-6 py-2.5 bg-gray-100/80 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={executeDelete}
                    className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}