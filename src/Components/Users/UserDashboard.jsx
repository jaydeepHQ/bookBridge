import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserModal from '../UserModel/UserModel';

import PageHeader from '../Common/PageHeader';

export default function UserDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://book-bridge-sage.vercel.app/api/users/1');
        // Currently the endpoint returns a single user. Wrapping in array so the table maps properly.
        if (response.data && response.data.userData) {
          const apiUser = response.data.userData;
          // Normalize the data format to match the component's expected standard
          const normalizedData = {
            id: `#${apiUser.user_id.toString().padStart(3, '0')}`,
            user_id: apiUser.user_id,
            fname: apiUser.firstname,
            lname: apiUser.lastname,
            email: apiUser.email,
            img: apiUser.profile_image
          };
          setUsers([normalizedData]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const [formData, setFormData] = useState({ id: '', fname: '', lname: '', email: '', password: '', img: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const filteredUsers = users.filter(user =>
    `${user.fname} ${user.lname}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        
        await axios.put(`https://book-bridge-sage.vercel.app/api/users/update-profile/${userId}`, formDataPayload, {
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
      const newId = `#${(users.length + 1).toString().padStart(3, '0')}`;
      setUsers([...users, { ...formData, id: newId }]);
    }
    setShowModal(false);
  };

  const deleteUser = (id) => {
    if (window.confirm("Delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
      if (currentUsers.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
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
                  <th className="px-8 py-5">First Name</th>
                  <th className="px-8 py-5">Last Name</th>
                  <th className="px-8 py-5">Email</th>
                  <th className="px-8 py-5">Image</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/30 transition">
                    <td className="px-8 py-5 font-bold">{user.id}</td>
                    <td className="px-8 py-5 font-bold">{user.fname}</td>
                    <td className="px-8 py-5 font-bold">{user.lname}</td>
                    <td className="px-8 py-5 text-gray-500">{user.email}</td>
                    <td className="px-8 py-5">
                      <img src={user.img} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" />
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => { setIsEditing(true); setFormData(user); setShowModal(true); }} className="p-2.5 bg-blue-600 text-white rounded-lg shadow-sm"><Edit2 size={16} /></button>
                        <button onClick={() => deleteUser(user.id)} className="p-2.5 bg-red-500 text-white rounded-lg shadow-sm"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
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