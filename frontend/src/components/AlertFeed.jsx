import React from 'react';
import { Check, Download } from 'lucide-react';

const AlertFeed = ({ alerts = [], onApprove }) => {
    // Ensure we are working with an array
    const safeAlerts = Array.isArray(alerts) ? alerts : [];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">All Alerts</h2>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-semibold flex items-center gap-2 transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>

            <div className="space-y-4">
                {safeAlerts.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                        No active alerts requiring attention.
                    </div>
                ) : (
                    safeAlerts.map((alert) => (
                        <div key={alert.id} className="p-5 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all bg-white group">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${alert.status === 'dispatched' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {alert.status}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{alert.village}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{alert.symptom}</p>
                                    <p className="text-xs font-mono text-slate-400 mt-2">
                                        Confidence: <span className="text-slate-700 font-bold">{(alert.confidence * 100).toFixed(0)}%</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                {alert.status === 'pending' ? (
                                    <button
                                        onClick={() => onApprove(alert.id)}
                                        className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Approve
                                    </button>
                                ) : (
                                    <div className="px-6 py-2 bg-slate-100 text-slate-500 rounded-lg font-bold text-sm flex items-center gap-2 cursor-not-allowed">
                                        <Check className="w-4 h-4" />
                                        Dispatched
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertFeed;
