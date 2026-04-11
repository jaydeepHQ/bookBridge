import React, { useState, useEffect } from 'react';
import { Search, Trash2, ChevronLeft, ChevronRight, Headphones } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import axios from 'axios';
import toast from 'react-hot-toast';

const getLanguageBadgeColor = (language) => {
  const defaultColor = 'bg-gray-50 text-gray-600 border-gray-200';
  if (!language) return defaultColor;
  const colors = {
    'english': 'bg-blue-50 text-blue-700 border-blue-200',
    'spanish': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'french': 'bg-purple-50 text-purple-700 border-purple-200',
    'german': 'bg-green-50 text-green-700 border-green-200',
    'italian': 'bg-red-50 text-red-700 border-red-200',
    'gujarati': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'hindi': 'bg-orange-50 text-orange-700 border-orange-200',
  };
  return colors[language.toLowerCase()] || 'bg-teal-50 text-teal-700 border-teal-200';
};

export default function ManageAudio() {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableLanguages, setAvailableLanguages] = useState(['All Languages']);
  const [filterLanguage, setFilterLanguage] = useState('All Languages');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Not authenticated.");
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/file/admin/outputs", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "*/*",
          }
        });

        const allDataArr = Array.isArray(response.data) ? response.data : (response.data.files || response.data.data || response.data.outputs || []);
        const dataArr = allDataArr.filter(item => item.operation_type === 'audio');

        const colors = [
          'bg-blue-50 text-blue-600', 'bg-green-50 text-green-600',
          'bg-purple-50 text-purple-600', 'bg-yellow-50 text-yellow-600',
          'bg-red-50 text-red-600'
        ];

        const mappedData = dataArr.map((item, idx) => ({
          id: item.output_id || item.id,
          fileId: item.file_id || '',
          filename: item.filename || 'Unknown File',
          language: item.language || 'English',
          userName: `${item.firstname || ''} ${item.lastname || ''}`.trim() || 'System',
          userEmail: item.email || 'No Email',
          userId: item.user_id || '',
          mimetype: item.mimetype || 'Unknown',
          createdAt: item.created_at || item.createdAt || new Date().toISOString(),
          color: colors[idx % colors.length]
        }));

        setAudios(mappedData);

        // Dynamically extract unique languages
        const uniqueLangs = [...new Set(mappedData.map(item => item.language).filter(Boolean))];
        setAvailableLanguages(['All Languages', ...uniqueLangs]);

      } catch (error) {
        console.error("Error fetching audio files:", error);
        toast.error("Failed to fetch audio files from server");
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/file/output/${itemToDelete}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setAudios(audios.filter(a => a.id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
      toast.success("Audio deleted successfully.");
    } catch (error) {
      console.error("Delete err:", error);
      toast.error("Failed to delete audio.");
    }
  };

  const filteredAudios = audios.filter(item => {
    const matchesSearch = String(item.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.filename).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.userName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.language).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.userEmail).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLanguage = filterLanguage === 'All Languages' || item.language === filterLanguage;

    return matchesSearch && matchesLanguage;
  });

  const totalItems = filteredAudios.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAudios.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLanguage]);

  return (
    <>
      <div className="p-8 min-h-screen bg-[#F8F9FC] font-['Inter']">
        <div>
          <PageHeader
            title="Manage Audio"
            subtitle="View and manage all document audio files in the system"
          />
        </div>

        <div className="flex gap-4 mb-6">
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
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 outline-none cursor-pointer"
          >
            {availableLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F9FC] border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Audio ID</th>
                  <th className="px-8 py-5">File</th>
                  <th className="px-8 py-5">Language</th>
                  <th className="px-8 py-5">User Info</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-12 text-center text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-lg text-gray-900 font-bold">Loading audio files...</p>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6 text-sm font-black text-gray-800">#{item.id}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                            <Headphones size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 truncate max-w-[200px]" title={item.filename}>{item.filename}</p>
                            <p className="text-[11px] font-bold text-gray-400 uppercase mt-0.5 tracking-wider" title={item.mimetype}>{item.mimetype}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${getLanguageBadgeColor(item.language)}`}>
                          {item.language}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-gray-800">{item.userName}</p>
                        <p className="text-xs font-semibold text-gray-400">{item.userEmail}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[13px] font-medium text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => confirmDelete(item.id)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-12 text-center text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <Search size={32} className="text-gray-300" />
                        </div>
                        <p className="text-lg text-gray-900 font-bold">No audio files found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteModal(false);
              setItemToDelete(null);
            }}
          ></div>
          <div className="relative bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center pt-8">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-50/50">
                <Trash2 className="text-red-500" size={32} />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Delete Audio?</h2>
              <p className="text-sm text-gray-500 font-medium px-4 mb-8">
                Are you sure you want to delete this audio file? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
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
    </>
  );
}