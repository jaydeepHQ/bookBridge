
import React from 'react';

export default function PageHeader({ title, subtitle, icon: Icon, children }) {
    return (
        <div className="mt-[38px] mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    {Icon && <Icon className="text-blue-600" size={32} />}
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-gray-500 text-sm mt-1 ml-1">{subtitle}</p>
                )}
            </div>
            {children && (
                <div className="flex gap-2">
                    {children}
                </div>
            )}
        </div>
    );
}
