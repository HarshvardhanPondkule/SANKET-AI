import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Activity, Map, Brain, Users, TrendingUp, CheckCircle, AlertTriangle, Mic, Camera, Upload, LogOut, Menu, X, Bell, Send, MapPin, Shield } from 'lucide-react';

// Main App Component
const SanketApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  
  useEffect(() => {
    // Check if user already logged in
    const savedUser = localStorage.getItem('sanket_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setShowLogin(false);
    }
  }, []);
  
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('sanket_user', JSON.stringify(user));
    setShowLogin(false);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sanket_user');
    setShowLogin(true);
  };
  
  if (showLogin) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  if (currentUser?.role === 'asha') {
    return <ASHAInterface user={currentUser} onLogout={handleLogout} />;
  }
  
  if (currentUser?.role === 'official') {
    return <OfficialDashboard user={currentUser} onLogout={handleLogout} />;
  }
  
  return <LoginPage onLogin={handleLogin} />;
};

// ============================================================================
// LOGIN PAGE
// ============================================================================

const LoginPage = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState('asha');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    village: '',
    phone: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In production, validate with backend
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: role,
      village: formData.village,
      phone: formData.phone
    };
    
    onLogin(user);
  };
  
  const demoLogin = (demoRole) => {
    const demoUsers = {
      asha: {
        id: 'asha_001',
        name: 'Priya Sharma',
        email: 'priya@asha.gov.in',
        role: 'asha',
        village: 'Dharavi',
        phone: '+91 98765 43210'
      },
      official: {
        id: 'official_001',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh@health.gov.in',
        role: 'official',
        district: 'Mumbai',
        designation: 'District Health Officer'
      }
    };
    
    onLogin(demoUsers[demoRole]);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sanket</h1>
          <p className="text-gray-600 mt-2">Quantum-Enhanced Epidemiology Network</p>
        </div>
        
        {/* Role Selection */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setRole('asha')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              role === 'asha'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ASHA Worker
          </button>
          <button
            onClick={() => setRole('official')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              role === 'official'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Health Official
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            required
          />
          
          {isSignup && role === 'asha' && (
            <>
              <input
                type="text"
                placeholder="Village Name"
                value={formData.village}
                onChange={(e) => setFormData({...formData, village: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
            </>
          )}
          
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-indigo-600 hover:underline"
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
        
        {/* Demo Logins */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3">Quick Demo Access</p>
          <div className="flex gap-2">
            <button
              onClick={() => demoLogin('asha')}
              className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
            >
              Demo ASHA
            </button>
            <button
              onClick={() => demoLogin('official')}
              className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200"
            >
              Demo Official
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ASHA WORKER INTERFACE
// ============================================================================

const ASHAInterface = ({ user, onLogout }) => {
  const [view, setView] = useState('report');
  const [recording, setRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [reportData, setReportData] = useState({
    symptoms: [],
    voice: null,
    image: null,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  
  const fileInputRef = useRef(null);
  
  const symptomOptions = [
    'Fever', 'Headache', 'Body Pain', 'Vomiting', 'Diarrhea',
    'Rash', 'Cough', 'Breathing Difficulty', 'Fatigue', 'Nausea'
  ];
  
  const toggleSymptom = (symptom) => {
    if (reportData.symptoms.includes(symptom)) {
      setReportData({
        ...reportData,
        symptoms: reportData.symptoms.filter(s => s !== symptom)
      });
    } else {
      setReportData({
        ...reportData,
        symptoms: [...reportData.symptoms, symptom]
      });
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setReportData({...reportData, image: file});
      };
      reader.readAsDataURL(file);
    }
  };
  
  const startRecording = () => {
    setRecording(true);
    // In production: actually record audio
    setTimeout(() => {
      setRecording(false);
      setReportData({...reportData, voice: 'recorded_audio.wav'});
    }, 3000);
  };
  
  const submitReport = async () => {
    if (reportData.symptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport = {
      id: Date.now(),
      symptoms: reportData.symptoms,
      hasVoice: !!reportData.voice,
      hasImage: !!reportData.image,
      notes: reportData.notes,
      timestamp: new Date().toLocaleString(),
      status: 'Processing'
    };
    
    setRecentReports([newReport, ...recentReports]);
    
    // Reset form
    setReportData({ symptoms: [], voice: null, image: null, notes: '' });
    setImagePreview(null);
    setSubmitting(false);
    
    alert('Report submitted successfully! AI agents are analyzing...');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Sanket ASHA</h1>
              <p className="text-sm text-indigo-100">{user.name} - {user.village}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setView('report')}
              className={`px-4 py-3 font-medium transition-colors ${
                view === 'report'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600'
              }`}
            >
              New Report
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-4 py-3 font-medium transition-colors ${
                view === 'history'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {view === 'report' && (
          <div className="space-y-6">
            {/* Symptom Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Symptoms</h2>
              <div className="grid grid-cols-2 gap-3">
                {symptomOptions.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-3 rounded-lg text-left font-medium transition-all ${
                      reportData.symptoms.includes(symptom)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Voice Recording */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Recording (Optional)</h2>
              <p className="text-sm text-gray-600 mb-4">Record patient description in local language</p>
              <button
                onClick={startRecording}
                disabled={recording}
                className={`w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                  recording
                    ? 'bg-red-500 text-white'
                    : reportData.voice
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Mic className="w-5 h-5" />
                {recording ? 'Recording...' : reportData.voice ? 'Voice Recorded ✓' : 'Start Recording'}
              </button>
            </div>
            
            {/* Image Upload */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Photo (Optional)</h2>
              <p className="text-sm text-gray-600 mb-4">Take photo of symptoms or environment</p>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              {imagePreview ? (
                <div className="space-y-3">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 text-gray-600"
                >
                  <Camera className="w-5 h-5" />
                  Take or Upload Photo
                </button>
              )}
            </div>
            
            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
              <textarea
                value={reportData.notes}
                onChange={(e) => setReportData({...reportData, notes: e.target.value})}
                placeholder="Any additional information..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                rows="4"
              />
            </div>
            
            {/* Submit Button */}
            <button
              onClick={submitReport}
              disabled={submitting || reportData.symptoms.length === 0}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        )}
        
        {view === 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
            {recentReports.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reports yet. Submit your first report!</p>
              </div>
            ) : (
              recentReports.map(report => (
                <div key={report.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">Report #{report.id}</p>
                      <p className="text-sm text-gray-500">{report.timestamp}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {report.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {report.symptoms.map(symptom => (
                      <span key={symptom} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {symptom}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    {report.hasVoice && <span>🎤 Voice</span>}
                    {report.hasImage && <span>📷 Image</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// HEALTH OFFICIAL DASHBOARD
// ============================================================================

const OfficialDashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('overview');
  const [alerts, setAlerts] = useState([
    { id: 1, severity: 'high', village: 'Dharavi', symptom: 'Fever cluster (8 cases)', confidence: 0.87, quantum: true, status: 'pending' },
    { id: 2, severity: 'medium', village: 'Kalyan', symptom: 'Dengue-like symptoms (5 cases)', confidence: 0.72, quantum: false, status: 'pending' },
    { id: 3, severity: 'low', village: 'Thane', symptom: 'Respiratory issues (2 cases)', confidence: 0.45, quantum: false, status: 'reviewed' }
  ]);
  
  const [swarmData] = useState({
    v1: { name: 'Dharavi', agents: 12, active: true, risk: 'high', belief: 0.82, cases: 8 },
    v2: { name: 'Kalyan', agents: 8, active: true, risk: 'medium', belief: 0.65, cases: 5 },
    v3: { name: 'Thane', agents: 15, active: true, risk: 'low', belief: 0.42, cases: 2 },
    v4: { name: 'Navi Mumbai', agents: 10, active: false, risk: 'normal', belief: 0.15, cases: 0 }
  });
  
  const [quantumInsights] = useState({
    outbreakProbability: 0.78,
    hiddenCorrelations: 3,
    resourceOptimization: 'Computed',
    affectedVillages: ['Dharavi', 'Kalyan', 'Thane']
  });
  
  const approveAlert = (alertId) => {
    setAlerts(alerts.map(a => 
      a.id === alertId ? {...a, status: 'approved'} : a
    ));
    alert('Resources dispatched! Medical team notified.');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sanket Command Center</h1>
                <p className="text-sm text-gray-600">{user.name} - {user.designation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {['overview', 'alerts', 'swarm', 'quantum', 'map'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-3 font-medium transition-colors capitalize ${
                  activeView === view
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Villages</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {Object.values(swarmData).filter(v => v.active).length}
                    </p>
                  </div>
                  <MapPin className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {alerts.filter(a => a.status === 'pending').length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Outbreak Risk</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(quantumInsights.outbreakProbability * 100).toFixed(0)}%
                    </p>
                  </div>
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Cases</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {Object.values(swarmData).reduce((sum, v) => sum + v.cases, 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
            
            {/* Recent Alerts */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts - Action Required</h2>
              <div className="space-y-3">
                {alerts.filter(a => a.status === 'pending').map(alert => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'bg-red-50 border-red-600' :
                      alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-600' :
                      'bg-blue-50 border-blue-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{alert.village}</span>
                          {alert.quantum && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              QUANTUM
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700">{alert.symptom}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Confidence: {(alert.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <button
                        onClick={() => approveAlert(alert.id)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                      >
                        Approve & Dispatch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Alerts View */}
        {activeView === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">All Alerts</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm">
                  Filter
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
                  Export Report
                </button>
              </div>
            </div>
            
            {alerts.map(alert => (
              <div key={alert.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      {alert.quantum && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          QUANTUM ANALYSIS
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        alert.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{alert.village}</h3>
                    <p className="text-gray-700 mb-2">{alert.symptom}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Confidence: {(alert.confidence * 100).toFixed(0)}%</span>
                      <span>•</span>
                      <span>Detected 15 min ago</span>
                    </div>
                  </div>
                  {alert.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveAlert(alert.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Swarm View */}
        {activeView === 'swarm' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Village Swarm Network</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(swarmData).map(([id, village]) => (
                <div key={id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{village.name}</h3>
                      <p className="text-sm text-gray-600">{village.agents} AI Agents</p>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${
                      village.active ? 'bg-green-500' : 'bg-gray-300'
                    }`}></span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk Level</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        village.risk === 'high' ? 'bg-red-100 text-red-800' :
                        village.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {village.risk.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Outbreak Belief</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(village.belief * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                        style={{ width: `${village.belief * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Cases Reported</span>
                      <span className="text-lg font-bold text-gray-900">{village.cases}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Quantum View */}
        {activeView === 'quantum' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-10 h-10" />
                <div>
                  <h2 className="text-2xl font-bold">Quantum Intelligence Layer</h2>
                  <p className="text-purple-100">TensorFlow Quantum Analysis</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Outbreak Probability</h3>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-gray-900">
                    {(quantumInsights.outbreakProbability * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500 mb-1">confidence</p>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
                    style={{ width: `${quantumInsights.outbreakProbability * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Hidden Correlations</h3>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-gray-900">{quantumInsights.hiddenCorrelations}</p>
                  <p className="text-sm text-gray-500 mb-1">detected</p>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Non-obvious transmission pathways discovered via quantum analysis
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Resource Optimization</h3>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-xl font-bold text-gray-900">{quantumInsights.resourceOptimization}</p>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  QAOA algorithm optimized resource distribution
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Affected Villages & Recommendations</h3>
              <div className="space-y-3">
                {quantumInsights.affectedVillages.map((village, idx) => (
                  <div key={village} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{village}</p>
                      <p className="text-sm text-gray-600">Priority: {idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Low'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">ORS Packets: {80 - (idx * 20)}</p>
                      <p className="text-sm text-gray-600">Medical Staff: {5 - idx}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Map View */}
        {activeView === 'map' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Village Risk Map</h2>
            <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 p-8">
                {/* Simulated Map Points */}
                <div className="absolute top-1/4 left-1/3">
                  <div className="relative">
                    <div className="w-16 h-16 bg-red-500 rounded-full opacity-50 animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        D
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold mt-2 text-center">Dharavi</p>
                  <p className="text-xs text-red-600 text-center">High Risk</p>
                </div>
                
                <div className="absolute top-2/3 left-1/2">
                  <div className="relative">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full opacity-50 animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        K
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold mt-2 text-center">Kalyan</p>
                  <p className="text-xs text-yellow-600 text-center">Medium Risk</p>
                </div>
                
                <div className="absolute top-1/2 right-1/4">
                  <div className="relative">
                    <div className="w-8 h-8 bg-green-500 rounded-full opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        T
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold mt-2 text-center">Thane</p>
                  <p className="text-xs text-green-600 text-center">Low Risk</p>
                </div>
              </div>
              
              <div className="text-center z-10">
                <Map className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Interactive Map View</p>
                <p className="text-sm text-gray-500">Real-time village risk visualization</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Low Risk</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SanketApp;