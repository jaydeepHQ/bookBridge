import React, { useState } from 'react';
import { Search, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../Common/PageHeader';

export default function ManageAudio() {
    const [audios, setAudios] = useState([
        { id: 'AUD001', bookId: 'BK001', audioPath: '/audio/chapter1.mp3', userId: 'USR123' },
        { id: 'AUD002', bookId: 'BK001', audioPath: '/audio/chapter2.mp3', userId: 'USR123' },
        { id: 'AUD003', bookId: 'BK002', audioPath: '/audio/intro.mp3', userId: 'USR456' },
        { id: 'AUD004', bookId: 'BK003', audioPath: '/audio/summary.mp3', userId: 'USR789' },
        { id: 'AUD005', bookId: 'BK004', audioPath: '/audio/epilogue.mp3', userId: 'USR321' },
        { id: 'AUD006', bookId: 'BK005', audioPath: '/audio/chapter1.mp3', userId: 'USR654' },
        { id: 'AUD007', bookId: 'BK006', audioPath: '/audio/chapter2.mp3', userId: 'USR987' },
        { id: 'AUD008', bookId: 'BK007', audioPath: '/audio/intro.mp3', userId: 'USR234' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const deleteAudio = (id) => {
        if (window.confirm("Delete this audio file?")) {
            setAudios(audios.filter(a => a.id !== id));
        }
    };

    // Filter Logic
    const filteredAudios = audios.filter(item => {
        const matchesSearch =
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.bookId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.audioPath.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Pagination Logic
    const totalItems = filteredAudios.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAudios.slice(indexOfFirstItem, indexOfLastItem);

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
                    title="Manage Audios"
                    subtitle="View and manage all Audios in the system"
                />
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                {/* Card Header with Search and Filter */}
                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-gray-800">Audio Files</h2>

                    <div className="flex gap-4">
                        {/* Search Bar */}
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search audio files..."
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
                        <thead>
                            <tr className="bg-gray-50/50 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4 text-center">Audio ID</th>
                                <th className="px-6 py-4 text-center">Book ID</th>
                                <th className="px-6 py-4 text-center">Audio Path</th>
                                <th className="px-6 py-4 text-center">User ID</th>
                                <th className="px-6 py-4 text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700 text-center font-medium">{item.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 text-center">{item.bookId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 text-center">
                                            {item.audioPath}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 text-center">{item.userId}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => deleteAudio(item.id)}
                                                className="text-red-500 hover:scale-110 transition-transform"
                                            >
                                                <Trash2 size={18} fill="currentColor" fillOpacity={0.1} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                                        No audio files found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination matching Users.jsx */}
                <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-white">
                    <p className="text-gray-400 text-sm font-medium">
                        Showing {filteredAudios.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, totalItems)} of {totalItems}
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