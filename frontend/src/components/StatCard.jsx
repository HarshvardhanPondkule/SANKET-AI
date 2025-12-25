
import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtext }) => {
    const styles = {
        indigo: 'border-indigo-600 text-indigo-600',
        red: 'border-red-600 text-red-600',
        purple: 'border-purple-600 text-purple-600',
        emerald: 'border-emerald-600 text-emerald-600',
        blue: 'border-blue-600 text-blue-600',
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${styles[color].split(' ')[0]} transition-transform hover:-translate-y-1 duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-3xl font-bold text-slate-900">{value}</p>
                        {subtext && <p className="text-sm text-slate-400">{subtext}</p>}
                    </div>
                </div>
                <div className={`p-3 rounded-lg bg-opacity-10 ${styles[color].replace('text', 'bg').replace('border', '')}`}>
                    <Icon className={`w-8 h-8 ${styles[color].split(' ')[1]}`} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
