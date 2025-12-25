
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Camera, Send, LogOut, CheckCircle, AlertCircle, History, FilePlus, ChevronLeft } from 'lucide-react';
import { api } from '../services/api';

const ASHA = ({ user, onLogout }) => {
    const [view, setView] = useState('report'); // report | history
    const [recording, setRecording] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [reportData, setReportData] = useState({ symptoms: [], voice: null, image: null, notes: '' });
    const [submitting, setSubmitting] = useState(false);
    const [recentReports, setRecentReports] = useState([]);
    const [apiStatus, setApiStatus] = useState({ connected: false, message: 'Connecting...' });

    const fileInputRef = useRef(null);
    const symptomOptions = ['Fever', 'Headache', 'Body Pain', 'Vomiting', 'Diarrhea', 'Rash', 'Cough', 'Breathing Difficulty', 'Fatigue', 'Nausea'];

    useEffect(() => {
        api.get('/health')
            .then(() => setApiStatus({ connected: true, message: 'Online' }))
            .catch(() => setApiStatus({ connected: false, message: 'Offline Mode' }));
    }, []);

    const toggleSymptom = (s) => {
        setReportData(d => ({
            ...d,
            symptoms: d.symptoms.includes(s) ? d.symptoms.filter(x => x !== s) : [...d.symptoms, s]
        }));
    };

    const handleImageUpload = (e) => {
        const f = e.target.files[0];
        if (f) {
            const r = new FileReader();
            r.onloadend = () => { setImagePreview(r.result); setReportData(d => ({ ...d, image: f })); };
            r.readAsDataURL(f);
        }
    };

    const startRecording = () => {
        setRecording(true);
        // Simulate recording - in prod use MediaRecorder API
        setTimeout(() => {
            setRecording(false);
            setReportData(d => ({ ...d, voice: new Blob(['audio'], { type: 'audio/wav' }) }));
        }, 3000);
    };

    const submitReport = async () => {
        if (reportData.symptoms.length === 0) { alert('Please select at least one symptom'); return; }
        setSubmitting(true);

        const newId = Date.now();
        const timestamp = new Date().toLocaleString();

        try {
            const formData = new FormData();
            formData.append('village_id', user.village || 'Dharavi');
            reportData.symptoms.forEach(s => formData.append('symptoms', s));
            if (reportData.voice) formData.append('voice', reportData.voice, 'voice.wav');
            if (reportData.image) formData.append('image', reportData.image);

            // Construct Query Params for prototype backend compatibility
            const query = `?village_id=${user.village || 'Dharavi'}&symptoms=${reportData.symptoms.join('&symptoms=')}`;
            const result = await api.postForm(`/api/v1/edge/submit-report${query}`, formData);

            const newReport = {
                id: newId,
                symptoms: reportData.symptoms,
                hasVoice: !!reportData.voice,
                hasImage: !!reportData.image,
                notes: reportData.notes,
                timestamp,
                status: 'Processed',
                apiResponse: result
            };

            setRecentReports(r => [newReport, ...r]);
            // Reset
            setReportData({ symptoms: [], voice: null, image: null, notes: '' });
            setImagePreview(null);
            alert('Report sent to Swarm Network!');
            setView('history');

        } catch (err) {
            console.error('Submit error:', err);
            // Offline fallback
            const newReport = {
                id: newId,
                symptoms: reportData.symptoms,
                hasVoice: !!reportData.voice,
                hasImage: !!reportData.image,
                notes: reportData.notes,
                timestamp,
                status: 'Queued (Offline)'
            };
            setRecentReports(r => [newReport, ...r]);
            setReportData({ symptoms: [], voice: null, image: null, notes: '' });
            setImagePreview(null);
            alert('Network unavailable. Report saved locally.');
            setView('history');
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Mobile Header */}
            <header className="bg-teal-600 text-white p-4 shadow-md z-10 sticky top-0">
                <div className="flex justify-between items-center max-w-lg mx-auto">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">SANKET</h1>
                        <p className="text-xs text-teal-100 opacity-90">{user.name} • {user.village}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${apiStatus.connected ? 'bg-emerald-400 text-teal-900' : 'bg-rose-500 text-white'}`}>
                            {apiStatus.message}
                        </span>
                        <button onClick={onLogout} className="p-2 bg-teal-700 rounded-full hover:bg-teal-800 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full pb-24">
                {view === 'report' ? (
                    <div className="space-y-6 animate-fade-in-up">

                        {/* Symptom Selector */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Core Symptoms</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {symptomOptions.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => toggleSymptom(s)}
                                        className={`p-4 rounded-xl text-left font-semibold text-sm transition-all duration-200 border-2
                      ${reportData.symptoms.includes(s)
                                                ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm transform scale-[1.02]'
                                                : 'bg-white border-slate-100 text-slate-600 hover:border-teal-200'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Multimodal Input */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={startRecording}
                                disabled={recording}
                                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all
                  ${recording
                                        ? 'bg-red-50 border-red-500 text-red-600 animate-pulse'
                                        : reportData.voice
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                                            : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${recording ? 'bg-red-100' : 'bg-slate-100'}`}>
                                    <Mic className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase">{recording ? 'Recording...' : reportData.voice ? 'Recorded' : 'Add Voice'}</span>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all overflow-hidden relative
                  ${imagePreview
                                        ? 'border-emerald-500'
                                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                )}
                                <span className="text-xs font-bold uppercase relative z-10 shadow-sm">{imagePreview ? 'Change Photo' : 'Add Photo'}</span>
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        </div>

                        {/* Notes */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <textarea
                                value={reportData.notes}
                                onChange={(e) => setReportData(d => ({ ...d, notes: e.target.value }))}
                                placeholder="Doctor's notes..."
                                className="w-full text-base placeholder-slate-400 text-slate-700 border-none focus:ring-0 p-0 resize-none h-24"
                            />
                        </div>

                        <div className="h-4"></div> {/* Spacer */}
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in-up">
                        <h2 className="text-lg font-bold text-slate-800 px-1">Recent Submissions</h2>
                        {recentReports.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl mx-4">
                                <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No reports submitted yet today.</p>
                            </div>
                        ) : (
                            recentReports.map(r => (
                                <div key={r.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-800">Case #{String(r.id).slice(-4)}</span>
                                            <span className="text-xs text-slate-400">{r.timestamp.split(',')[1]}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {r.symptoms.map(s => <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{s}</span>)}
                                        </div>
                                        <div className="flex gap-3 text-xs text-slate-400">
                                            {r.hasVoice && <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> Voice</span>}
                                            {r.hasImage && <span className="flex items-center gap-1"><Camera className="w-3 h-3" /> Photo</span>}
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded-full ${r.status.includes('Offline') ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        {r.status.includes('Offline') ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Floating Action Navigation */}
            <div className="fixed bottom-6 left-0 right-0 px-6 z-20 flex justify-center max-w-lg mx-auto">
                <div className="bg-slate-900 rounded-full p-1.5 shadow-2xl flex items-center gap-1">
                    <button
                        onClick={() => setView('report')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all
              ${view === 'report' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <FilePlus className="w-5 h-5" />
                        {view === 'report' && <span>Report</span>}
                    </button>

                    <button
                        onClick={() => {
                            if (view === 'report' && reportData.symptoms.length > 0) {
                                submitReport();
                            } else {
                                setView('history');
                            }
                        }}
                        disabled={view === 'report' && reportData.symptoms.length === 0}
                        className={`flex items-center justify-center w-14 h-14 rounded-full transition-all
               ${view === 'report'
                                ? (reportData.symptoms.length > 0 ? 'bg-white text-teal-600 hover:scale-105' : 'bg-slate-800 text-slate-600')
                                : 'hidden'}`}
                    >
                        <Send className="w-6 h-6 ml-0.5" />
                    </button>

                    <button
                        onClick={() => setView('history')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all
              ${view === 'history' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <History className="w-5 h-5" />
                        {view === 'history' && <span>History</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ASHA;
