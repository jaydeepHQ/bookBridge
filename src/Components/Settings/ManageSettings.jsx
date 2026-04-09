import React, { useState } from 'react';
import PageHeader from '../Common/PageHeader';

export default function ManageSettings() {
    const [companies] = useState([
        { id: 1, name: 'TechCorp Solutions', initial: 'T', color: 'bg-blue-600' },
        { id: 2, name: 'Innovate Digital', initial: 'I', color: 'bg-purple-600' },
        { id: 3, name: 'Global Enterprises', initial: 'G', color: 'bg-green-600' },
        { id: 4, name: 'NextGen Systems', initial: 'N', color: 'bg-orange-500' },
        { id: 5, name: 'Apex Industries', initial: 'A', color: 'bg-red-600' },
        { id: 6, name: 'Stellar Technologies', initial: 'S', color: 'bg-indigo-600' },
        { id: 7, name: 'Vertex Group', initial: 'V', color: 'bg-pink-500' },
        { id: 8, name: 'Quantum Solutions', initial: 'Q', color: 'bg-teal-600' },
    ]);

    return (
        <div className="p-8 min-h-screen bg-[#F8F9FC] font-['Inter']">
            <div>
                <PageHeader
                    title="Manage Settings"
                    subtitle=""
                />
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4 text-center w-32">Logo</th>
                                <th className="px-6 py-4">Company Name</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {companies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4 text-center">
                                        <div className={`w-10 h-10 rounded-lg ${company.color} flex items-center justify-center text-white font-bold mx-auto shadow-sm`}>
                                            {company.initial}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                        {company.name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
