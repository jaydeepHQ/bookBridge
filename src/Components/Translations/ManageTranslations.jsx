import React, { useState } from 'react';
import { Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../Common/PageHeader';

export default function ManageTranslations() {
  const [translations, setTranslations] = useState([
    // { id: 'TR-001', bookId: 'BK-123', language: 'Spanish', userId: 'USR-456', color: 'bg-blue-50 text-blue-600' },
    // { id: 'TR-002', bookId: 'BK-124', language: 'French', userId: 'USR-789', color: 'bg-green-50 text-green-600' },
    // { id: 'TR-003', bookId: 'BK-125', language: 'German', userId: 'USR-321', color: 'bg-purple-50 text-purple-600' },
    // { id: 'TR-004', bookId: 'BK-126', language: 'Italian', userId: 'USR-654', color: 'bg-yellow-50 text-yellow-600' },
    // { id: 'TR-005', bookId: 'BK-127', language: 'Portuguese', userId: 'USR-987', color: 'bg-red-50 text-red-600' },
    // { id: 'TR-006', bookId: 'BK-128', language: 'Spanish', userId: 'USR-234', color: 'bg-blue-50 text-blue-600' },
    // { id: 'TR-007', bookId: 'BK-129', language: 'French', userId: 'USR-567', color: 'bg-green-50 text-green-600' },
    // { id: 'TR-008', bookId: 'BK-130', language: 'German', userId: 'USR-890', color: 'bg-purple-50 text-purple-600' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('All Languages');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const deleteTranslation = (id) => {
    if (window.confirm("Delete this translation?")) {
      setTranslations(translations.filter(t => t.id !== id));
    }
  };

  // Filter Logic
  const filteredTranslations = translations.filter(item => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bookId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.language.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLanguage = filterLanguage === 'All Languages' || item.language === filterLanguage;

    return matchesSearch && matchesLanguage;
  });

  // Pagination Logic
  const totalItems = filteredTranslations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTranslations.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLanguage]);

  return (
    <div className="p-8 min-h-screen bg-[#F8F9FC] font-['Inter']">
      <div>
        {/* for page header to show title and subtitle*/}
        <PageHeader
          title="Manage Translations"
          subtitle="View and manage all Translations in the system"
        />
      </div>

      {/* Filters Section */}
      <div className="flex gap-4 mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
          />
        </div>
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 outline-none"
        >
          <option>All Languages</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
          <option>Italian</option>
          <option>Portuguese</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8F9FC] border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Translation ID</th>
                <th className="px-8 py-5">Book ID</th>
                <th className="px-8 py-5">Language</th>
                <th className="px-8 py-5">User ID</th>
                <th className="px-8 py-5 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6 text-sm font-black text-gray-800">{item.id}</td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-400">{item.bookId}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${item.color || 'bg-gray-50 text-gray-600'}`}>
                        {item.language}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-400">{item.userId}</td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => deleteTranslation(item.id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                      >
                        <Trash2 size={20} />
                      </button>
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
                      <p className="text-lg text-gray-900 font-bold">No translations found</p>
                      <p className="text-sm">We couldn't find any translations matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Users.jsx */}
        <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-white">
          <p className="text-gray-400 text-sm font-medium">
            Showing {filteredTranslations.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} translations
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
    </div>
  );
}