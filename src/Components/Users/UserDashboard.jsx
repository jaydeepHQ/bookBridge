import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, ChevronLeft, ChevronRight, X, Image as ImageIcon, User } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserModal from '../UserModel/UserModel';

import PageHeader from '../Common/PageHeader';

export default function UserDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');

        if (response.data && response.data.users) {
          const normalizedUsers = response.data.users.map((apiUser) => ({
            id: `#${apiUser.user_id.toString().padStart(3, '0')}`,
            user_id: apiUser.user_id,
            fname: apiUser.firstname,
            lname: apiUser.lastname,
            email: apiUser.email,
            img: apiUser.profile_image,
            role: apiUser.role || 'User'
          }));
          setUsers(normalizedUsers);
        }

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);




  console.log("api user", users)

  const [formData, setFormData] = useState({ id: '', fname: '', lname: '', email: '', password: '', img: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const filteredUsers = users
    .filter(user => `${user.fname} ${user.lname}`.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const isAAdmin = a.role?.toLowerCase() === 'admin';
      const isBAdmin = b.role?.toLowerCase() === 'admin';
      if (isAAdmin && !isBAdmin) return -1;
      if (!isAAdmin && isBAdmin) return 1;
      return 0;
    });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, img: imageUrl, file: file });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        const formDataPayload = new FormData();
        formDataPayload.append('email', formData.email);
        formDataPayload.append('firstname', formData.fname);
        formDataPayload.append('lastname', formData.lname);
        if (formData.file) {
          formDataPayload.append('image', formData.file);
        }

        // Assuming user_id exists in formData from previous normalization, otherwise fallback to 1 
        const userId = formData.user_id || 1;

        await axios.put(`/api/users/update-profile/${userId}`, formDataPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': '*/*'
          }
        });

        // Update local state to reflect changes instantly without needing a refetch
        setUsers(users.map(u => u.id === formData.id ? {
          ...u,
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          img: formData.img
        } : u));

        toast.success('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update profile. Please try again.');
      }
    } else {
      try {
        const payload = {
          firstname: formData.fname,
          lastname: formData.lname,
          email: formData.email,
          password: formData.password
        };

        const response = await axios.post('/api/users/register', payload, {
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          }
        });

        const apiUser = response.data?.user || response.data?.userData || response.data;
        const newUserId = apiUser?.user_id;
        const newId = newUserId ? `#${newUserId.toString().padStart(3, '0')}` : `#${(users.length + 1).toString().padStart(3, '0')}`;

        setUsers([...users, {
          id: newId,
          user_id: newUserId,
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          img: formData.img,
          role: apiUser?.role || 'User'
        }]);

        toast.success('User registered successfully!');
      } catch (error) {
        console.error('Error registering user:', error);
        toast.error(error.response?.data?.message || 'Failed to register user. Please try again.');
        return; // prevent modal from closing if API fails
      }
    }
    setShowModal(false);
  };

  const confirmDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`/api/users/delete/${userToDelete}`, {
        headers: {
          'accept': '*/*'
        }
      });
      setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userToDelete));
      setShowDeleteModal(false);
      setUserToDelete(null);
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error('Failed to delete user. Please try again.');
    }
  };

  return (
    <>
      <div className="p-8 min-h-screen bg-[#F8F9FC] font-['Inter']">
        <PageHeader
          title="Manage Users"
          subtitle="View and manage all registered users"
        >
          <button
            onClick={() => { setIsEditing(false); setFormData({ id: '', fname: '', lname: '', email: '', password: '', img: '' }); setShowModal(true); }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} strokeWidth={3} /> Add User
          </button>
        </PageHeader>

        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full max-w-md pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">Name</th>
                  <th className="px-8 py-5">Email</th>
                  <th className="px-8 py-5">Image</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/30 transition">
                      <td className="px-8 py-5 font-bold">{user.id}</td>
                      <td className="px-8 py-5 font-bold">{user.fname} {user.lname}</td>
                      <td className="px-8 py-5 text-gray-500">{user.email}</td>
                      <td className="px-8 py-5">
                        {user.img ? (
                          <img src={user.img} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-md">
                            <User size={20} className="text-blue-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold inline-block capitalize">{user.role || 'User'}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => { setIsEditing(true); setFormData(user); setShowModal(true); }} className="p-2.5 bg-blue-600 text-white rounded-lg shadow-sm"><Edit2 size={16} /></button>
                          {user.role?.toLowerCase() !== 'admin' && (
                            <button onClick={() => confirmDeleteUser(user.user_id || user.id)} className="p-2.5 bg-red-500 text-white rounded-lg shadow-sm"><Trash2 size={16} /></button>
                          )}
                        </div>
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
                        <p className="text-lg text-gray-900 font-bold">No users found</p>
                        <p className="text-sm">We couldn't find any users matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-white">
            <p className="text-gray-400 text-sm font-medium">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border border-gray-200 ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                <ChevronLeft size={20} />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === index + 1 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border border-gray-200 ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'}`}
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
          {/* Black background overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteModal(false);
              setUserToDelete(null);
            }}
          ></div>

          {/* Modal Panel */}
          <div className="relative bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center pt-8">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-50/50">
                <Trash2 className="text-red-500" size={32} />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Delete User?</h2>
              <p className="text-sm text-gray-500 font-medium px-4 mb-8">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-center border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
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
      <UserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
      />
    </>
  );
}