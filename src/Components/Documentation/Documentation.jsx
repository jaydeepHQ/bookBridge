import React from 'react';
import { BookOpen, Users, FileText, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Section = ({ title, icon: Icon, children }) => {
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>

            {isOpen && (
                <div className="px-6 py-4 border-t border-gray-100">
                    <div className="prose prose-blue max-w-none text-gray-600">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Documentation() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8F9FC] font-['Inter']">
            {/* Header */}
            <div className="bg-blue-600 text-white py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-6 text-blue-200 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        ← Back to Login
                    </button>
                    <h1 className="text-3xl font-bold mb-2">Documentation</h1>
                    <p className="text-blue-100">Everything you need to know about managing the Admin Panel</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 -mt-8 pb-12">

                {/* Getting Started */}
                <Section title="Getting Started" icon={BookOpen}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">How to Login</h4>
                            <p>Access the admin panel using your registered email address and password. If you forget your password, use the "Forgot password" link on the login screen to reset it.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Dashboard Overview</h4>
                            <p>The dashboard provides a high-level view of your application's performance. It includes key metrics, recent activity, and quick access to common tasks.</p>
                        </div>
                    </div>
                </Section>

                {/* User Management */}
                <Section title="User Management" icon={Users}>
                    <div className="space-y-4">
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Add User:</strong> Click the "Add User" button in the Users section to create a new account.</li>
                            <li><strong>Edit User:</strong> Use the edit icon next to a user's name to update their details.</li>
                            <li><strong>Delete User:</strong> Remove a user permanently using the delete (trash) icon.</li>
                            <li><strong>Assign Roles:</strong> Manage user permissions by assigning appropriate roles (Admin, Editor, Viewer).</li>
                        </ul>
                    </div>
                </Section>

                {/* Reports Section */}
                <Section title="Reports Section" icon={FileText}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">How to View Reports</h4>
                            <p>Navigate to the Reports section to verify system analytics. You can filter reports by date range or category to find specific information.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Export Data</h4>
                            <p>Most tables and reports can be exported to CSV or PDF format using the "Export" button found at the top of the data table.</p>
                        </div>
                    </div>
                </Section>

                {/* Settings */}
                <Section title="Settings" icon={Settings}>
                    <div className="space-y-4">
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Profile Settings:</strong> Update your personal information and profile picture.</li>
                            <li><strong>Change Password:</strong> Secure your account by regularly updating your password in the Security tab.</li>
                            <li><strong>Notification Settings:</strong> Configure which email or system notifications you want to receive.</li>
                        </ul>
                    </div>
                </Section>

            </div>
        </div>
    );
}
