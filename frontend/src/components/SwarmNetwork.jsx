
import React from 'react';

const SwarmNetwork = ({ nodes }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(nodes).map(([id, node]) => (
                <div key={id} className="group bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative overflow-hidden transition-all hover:shadow-lg hover:border-blue-200">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full transition-transform group-hover:scale-110 
            ${node.risk_level === 'high' || node.risk_level === 'critical' ? 'from-red-500 to-red-600'
                            : node.risk_level === 'medium' ? 'from-yellow-400 to-amber-500'
                                : 'from-emerald-400 to-teal-500'}`}
                    />

                    <div className="flex items-start justify-between mb-6 relative">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{node.name}</h3>
                            <p className="text-xs font-mono text-slate-400 mt-1">ID: {id.substring(0, 8)}...</p>
                        </div>
                        <div className={`relative flex items-center justify-center w-3 h-3 rounded-full 
              ${node.risk_level !== 'normal' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping 
                ${node.risk_level !== 'normal' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                        </div>
                    </div>

                    <div className="space-y-4 relative">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-slate-500 uppercase">Outbreak Probability</span>
                                <span className="text-sm font-bold text-slate-700">{((node.outbreak_belief || 0) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-1000 ease-out
                   ${node.risk_level === 'high' ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                        : node.risk_level === 'medium' ? 'bg-gradient-to-r from-amber-400 to-yellow-400'
                                            : 'bg-gradient-to-r from-blue-400 to-cyan-400'}`}
                                    style={{ width: `${(node.outbreak_belief || 0) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-xs text-slate-500 font-medium">Active Signals</span>
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                                {node.symptom_count || 0} Reports
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SwarmNetwork;
