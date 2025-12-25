# Sanket - Quantum-Enhanced Epidemiology Network 🦠⚛️

**AI-powered disease outbreak detection using Google ADK multi-agent swarm intelligence and quantum computing**

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Google ADK](https://img.shields.io/badge/Google%20ADK-1.21.0-green.svg)](https://pypi.org/project/google-adk/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.123-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Overview

Sanket combines three cutting-edge technologies to revolutionize disease outbreak detection:

1. **Google ADK** - Multi-agent swarm intelligence for distributed analysis
2. **Gemini AI** - Edge processing of voice/image symptom reports
3. **Quantum Computing** - Pattern amplification and resource optimization (Cirq/TensorFlow Quantum)

## ✨ Features

### Real Google ADK Integration
- ✅ Uses `google-adk==1.21.0` (real package)
- ✅ 4 autonomous village agents
- ✅ 6 custom tools per agent
- ✅ Multi-agent orchestration

### Multi-Agent Swarm Intelligence
- ✅ Distributed consensus protocols
- ✅ Agent-to-agent communication
- ✅ Autonomous decision making
- ✅ Network topology management

### Quantum Enhancement
- ✅ Cirq quantum simulation
- ✅ Pattern detection circuits
- ✅ Resource allocation optimization
- ✅ Causality analysis

### Privacy-Preserving
- ✅ Anonymized data sharing
- ✅ Aggregated symptom reports
- ✅ No PII exposure
  
<img width="1918" height="976" alt="image" src="https://github.com/user-attachments/assets/969ff00e-2d85-446f-b25f-3d0a2303cad6" />
<img width="1918" height="983" alt="f8" src="https://github.com/user-attachments/assets/989ef895-8e41-4ab6-96aa-6ee82f1ceb7e" />
<img width="1918" height="980" alt="f9" src="https://github.com/user-attachments/assets/8a9be03e-7d7a-4618-814c-d5bc78cf9779" />
<img width="1918" height="983" alt="f2" src="https://github.com/user-attachments/assets/36dc93b4-a431-4229-b573-f15b1b088803" />
<img width="1918" height="976" alt="f3" src="https://github.com/user-attachments/assets/9a0dfeab-24c0-4a59-850b-7433d80cdc99" />
<img width="1917" height="986" alt="f4" src="https://github.com/user-attachments/assets/55930842-3a32-4e1a-96d4-5b08ecb5bc65" />
<img width="1918" height="977" alt="f5" src="https://github.com/user-attachments/assets/4f3b297f-a26f-4f21-9506-01fbbad5fbff" />
<img width="1918" height="982" alt="f6" src="https://github.com/user-attachments/assets/4ae118c3-f55c-4696-9eb9-6cb9c71ba373" />
<img width="1918" height="978" alt="f7" src="https://github.com/user-attachments/assets/7ce91913-6a4f-44da-bfc4-a894748b57c0" />


## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API key (optional for full functionality)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/soham164/sanket-quant.git
cd sanket-quant
```

2. **Setup Python environment**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY (optional)
```

4. **Start backend**
```bash
python run_backend.py
# Server runs at http://localhost:8000
```

5. **Start frontend** (separate terminal)
```bash
cd frontend
npm install
npm run dev
# Dashboard at http://localhost:5173
```

## 📁 Project Structure

```
sanket/
├── backend/
│   └── app/
│       ├── main.py              # FastAPI app with ADK integration
│       ├── services/
│       │   ├── adk_swarm_service.py    # ADK orchestration
│       │   ├── edge_ai_service.py      # Gemini processing
│       │   └── quantum_service.py      # Quantum analysis
│       └── api/v1/              # REST endpoints
├── swarm/
│   ├── agents/
│   │   └── village_adk_agent.py        # ADK-powered agents
│   ├── orchestrator/
│   │   └── swarm_orchestrator.py       # Multi-agent coordination
│   ├── tools/                   # Agent tools (ADK)
│   └── workflows/               # Coordinated workflows
├── quantum/
│   └── cirq_integration.py      # Quantum circuits
├── frontend/
│   └── src/
│       └── App.jsx              # React dashboard
└── config/
    ├── adk_config.yaml          # ADK settings
    └── swarm_config.yaml        # Network topology
```

## 🤖 How It Works

### 1. Symptom Report Flow
```
Patient → Voice/Image → Gemini → ADK Agent → Swarm Analysis → Quantum (if needed)
```

### 2. ADK Agent Autonomy
Each village agent has tools:
- `analyze_symptoms` - Local pattern detection
- `query_neighbors` - AI-to-AI communication
- `propose_consensus` - Distributed decision making
- `vote` - Consensus protocol
- `escalate_to_quantum` - Trigger deep analysis
- `share_data` - Privacy-preserving data sharing

### 3. Swarm Collaboration
Agents autonomously:
1. Detect local anomalies
2. Query neighbors
3. Reach consensus
4. Escalate to quantum layer

### 4. Quantum Enhancement
- Pattern detection in noisy data
- Resource allocation optimization
- Causality discovery

## 📊 API Endpoints

### Health Check
```bash
GET http://localhost:8000/health
```

### Submit Symptom Report
```bash
POST http://localhost:8000/api/v1/edge/submit-report
# Triggers full ADK workflow
```

### Swarm Status
```bash
GET http://localhost:8000/api/v1/swarm/agents
# Get all ADK agents status
```

### Quantum Analysis
```bash
POST http://localhost:8000/api/v1/quantum/analyze
# Run quantum pattern detection
```

## 🧪 Testing

```bash
# Test all services
python test_startup.py

# Test symptom submission
curl -X POST http://localhost:8000/api/v1/edge/submit-report \
  -H "Content-Type: application/json" \
  -d '{
    "village_id": "v1",
    "symptoms": ["fever", "headache", "vomiting"]
  }'
```

## 🔧 Configuration

### ADK Settings (`config/adk_config.yaml`)
- Model: gemini-1.5-flash
- Temperature: 0.7
- Orchestration: collaborative, peer-to-peer

### Swarm Network (`config/swarm_config.yaml`)
- 4 villages: Dharavi, Kalyan, Thane, Navi Mumbai
- Network topology with neighbors
- Consensus threshold: 66%

## 📈 Performance

- **Backend Startup:** ~3 seconds
- **Frontend Startup:** ~1.6 seconds
- **API Response Time:** <100ms
- **Agent Initialization:** 4 agents in <1 second
- **Quantum Circuit Execution:** <500ms

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Web framework
- **Google ADK** - Multi-agent system
- **Cirq** - Quantum computing
- **TensorFlow** - ML framework
- **Pydantic** - Data validation

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icons

### AI/ML
- **Google Gemini** - Edge AI processing
- **Google ADK** - Agent framework
- **Cirq** - Quantum simulation
- **NumPy/Pandas** - Data processing

## 📝 Development Status

### ✅ Complete
- ADK multi-agent system
- Swarm orchestration
- Quantum integration (Cirq)
- Frontend dashboard
- API endpoints
- Real-time monitoring

### 🚧 Future Enhancements
- Database persistence (PostgreSQL)
- Authentication & authorization
- Production deployment (Docker/K8s)
- Comprehensive test suite
- Real-world data integration

## 🤝 Contributing

Contributions are welcome! This is a research/demo project showcasing:
- Google ADK for multi-agent systems
- Quantum-enhanced ML
- Edge AI processing

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Google ADK** - Multi-agent framework
- **Cirq** - Quantum computing framework
- **TensorFlow Quantum** - Quantum ML
- **FastAPI** - Web framework
- **React** - Frontend framework

**⭐ Star this repo if you find it interesting!**

## 🎓 Research & Education

This project demonstrates:
- Real-world application of Google ADK
- Multi-agent system design patterns
- Quantum computing in healthcare
- Edge AI processing
- Distributed consensus protocols

Perfect for:
- AI/ML researchers
- Healthcare tech developers
- Quantum computing enthusiasts
- Multi-agent system learners

---

**Built with ❤️ using Google ADK, Cirq, and FastAPI**
