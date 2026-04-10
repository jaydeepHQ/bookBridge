import React from 'react';
import { X } from 'lucide-react';

export default function UserModal({
  show,
  onClose,
  isEditing,
  formData,
  setFormData,
  handleSave,
  fileInputRef,
  handleImageChange
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Profile' : 'User Information'}
            </h2>
            {isEditing && (
              <p className="text-gray-400 text-xs font-medium">Update your profile information</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form className="p-8 space-y-5" onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
              <input
                required
                type="text"
                value={formData.fname}
                onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition"
                placeholder="Enter First name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
              <input
                required
                type="text"
                value={formData.lname}
                onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition"
                placeholder="Enter Last name"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition"
              placeholder="Enter email address"
            />
          </div>

          {/* Image Upload Section */}
          {isEditing && (
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Image</label>
              <div className="flex items-center gap-3 p-1 border border-gray-200 rounded-xl bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-white px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 shadow-sm transition"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <span className="text-xs text-gray-400 truncate flex-1">
                  {formData.img ? 'Image selected' : 'No file chosen'}
                </span>
                {formData.img && (
                  <img src={formData.img} className="w-8 h-8 rounded-lg object-cover mr-2 border border-gray-200" alt="preview" />
                )}
              </div>
            </div>
          )}

          {/* Password - Only shown when ADDING, not Editing */}
          {!isEditing && (
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition"
                placeholder="Enter password"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
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
  );
}