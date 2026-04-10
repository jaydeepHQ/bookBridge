import React, { useState } from 'react';
import { Search, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../Common/PageHeader';

export default function ManageQuiz() {
    const [quizzes, setQuizzes] = useState([
        { id: 'QZ001', bookId: 'BK001', userId: 'USR001' },
        { id: 'QZ002', bookId: 'BK003', userId: 'USR002' },
        { id: 'QZ003', bookId: 'BK002', userId: 'USR003' },
        { id: 'QZ004', bookId: 'BK005', userId: 'USR001' },
        { id: 'QZ005', bookId: 'BK004', userId: 'USR004' },
        { id: 'QZ006', bookId: 'BK001', userId: 'USR005' },
        { id: 'QZ007', bookId: 'BK006', userId: 'USR002' },
        { id: 'QZ008', bookId: 'BK002', userId: 'USR003' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const deleteQuiz = (id) => {
        if (window.confirm("Delete this quiz?")) {
            setQuizzes(quizzes.filter(q => q.id !== id));
        }
    };

    // Filter Logic
    const filteredQuizzes = quizzes.filter(item => {
        const matchesSearch =
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.bookId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.userId.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Pagination Logic
    const totalItems = filteredQuizzes.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredQuizzes.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="p-8 min-h-screen bg-[#F8F9FC] font-['Inter']">
            <div>
                <PageHeader
                    title="Manage Quiz"
                    subtitle="View and manage all Quiz in the system"
                />
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                {/* Card Header with Search and Filter */}
                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-gray-800">Quiz Files</h2>

                    <div className="flex gap-4">
                        {/* Search Bar */}
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search quiz..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
                            />
                        </div>

                        {/* Filter Button */}
                        <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FC] border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Quiz ID</th>
                                <th className="px-8 py-5">Book ID</th>
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
                                        <td className="px-8 py-6 text-sm font-bold text-gray-400">{item.userId}</td>
                                        <td className="px-8 py-6 text-center">
                                            <button
                                                onClick={() => deleteQuiz(item.id)}
                                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-12 text-center text-gray-500 font-medium">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Search size={32} className="text-gray-300" />
                                            </div>
                                            <p className="text-lg text-gray-900 font-bold">No quizzes found</p>
                                            <p className="text-sm">We couldn't find any quizzes matching your criteria.</p>
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
                        Showing {filteredQuizzes.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, totalItems)} of {totalItems}
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
