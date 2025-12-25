"""
Updated FastAPI Backend with ADK Integration
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import os

# Import services
from backend.app.services.edge_ai_service import GeminiEdgeProcessor
from backend.app.services.quantum_service import QuantumService

# ============================================================================
# Initialize FastAPI
# ============================================================================

app = FastAPI(
    title="Sanket API with ADK",
    description="Quantum-Enhanced Epidemiology Network with AI Development Kit",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Initialize Services with ADK
# ============================================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your-api-key")

# Initialize in correct order (quantum first, then swarm with quantum)
quantum_service = QuantumService()
gemini_processor = GeminiEdgeProcessor(api_key=GEMINI_API_KEY)

# Import and initialize ADK swarm service with quantum service
from backend.app.services.adk_swarm_service import ADKSwarmService
adk_swarm_service = ADKSwarmService(quantum_service=quantum_service)

# ============================================================================
# Data Models
# ============================================================================

class SymptomReportRequest(BaseModel):
    village_id: str
    symptoms: List[str]
    environmental_factors: Optional[List[str]] = []
    vital_signs: Optional[Dict] = {}

# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/")
async def root():
    return {
        "service": "Sanket API with ADK Integration",
        "version": "2.0.0",
        "components": {
            "edge_ai": "Gemini API",
            "swarm": "ADK Multi-Agent System",
            "quantum": "TensorFlow Quantum"
        },
        "adk_features": [
            "Autonomous agent tools",
            "Multi-agent orchestration",
            "Workflow coordination",
            "Built-in consensus protocols"
        ]
    }

@app.get("/health")
async def health_check():
    adk_status = adk_swarm_service.get_network_status()
    
    return {
        "status": "healthy",
        "services": {
            "edge_ai": "operational",
            "adk_swarm": "operational",
            "quantum": "operational"
        },
        "adk_agents": {
            "total": adk_status['total_agents'],
            "active": adk_status['total_agents']
        }
    }

# ============================================================================
# Edge AI Endpoints (Gemini)
# ============================================================================

@app.post("/api/v1/edge/submit-report")
async def submit_symptom_report(
    village_id: str,
    symptoms: List[str],
    voice: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None)
):
    """
    🔥 COMPLETE FLOW WITH ADK:
    1. Gemini processes voice/image (Edge AI)
    2. ADK agent receives data
    3. Agent autonomously uses tools to analyze and communicate
    4. Agent coordinates with neighbors via ADK orchestrator
    5. If consensus reached, agent triggers quantum
    """
    
    print(f"\n{'='*70}")
    print(f"📥 NEW SYMPTOM REPORT: Village {village_id}")
    print(f"{'='*70}")
    
    # STEP 1: Process with Gemini (Edge AI)
    edge_analysis = {}
    
    if voice:
        voice_bytes = await voice.read()
        voice_result = await gemini_processor.process_voice(voice_bytes)
        edge_analysis['voice'] = voice_result
        symptoms.extend(voice_result['symptoms_extracted'])
        print(f"🎤 Voice processed: {voice_result['symptoms_extracted']}")
    
    if image:
        image_bytes = await image.read()
        image_result = await gemini_processor.process_image(image_bytes)
        edge_analysis['image'] = image_result
        print(f"📷 Image analyzed: {image_result['detected_conditions']}")
    
    normalized = await gemini_processor.normalize_symptoms(symptoms, {})
    edge_analysis['normalized'] = normalized
    
    # STEP 2: Send to ADK Swarm (Autonomous Agent Processing)
    print(f"\n🤖 Sending to ADK Agent...")
    
    adk_result = await adk_swarm_service.process_symptom_report(
        village_id=village_id,
        symptoms=symptoms,
        metadata={'edge_analysis': edge_analysis}
    )
    
    print(f"✓ ADK Agent processed report")
    print(f"  Actions taken: {adk_result.get('autonomous_actions_taken', [])}")
    
    # STEP 3: Check if agent triggered quantum escalation
    quantum_result = None
    agent_response = adk_result.get('agent_response', {})
    
    if 'escalate_to_quantum' in adk_result.get('autonomous_actions_taken', []):
        print(f"\n⚛️  ADK Agent triggered quantum analysis...")
        
        swarm_data = adk_swarm_service.get_network_status()
        quantum_result = await quantum_service.detect_outbreak_pattern(swarm_data)
        
        print(f"✓ Quantum analysis complete")
        print(f"  Outbreak probability: {quantum_result['outbreak_probability']:.2f}")
    
    print(f"{'='*70}\n")
    
    return {
        'status': 'processed',
        'edge_analysis': edge_analysis,
        'adk_agent_response': adk_result,
        'quantum_analysis': quantum_result,
        'workflow': 'adk_autonomous'
    }

# ============================================================================
# ADK Swarm Endpoints
# ============================================================================

@app.get("/api/v1/swarm/agents")
async def get_adk_agents():
    """Get all ADK agents status"""
    return adk_swarm_service.get_network_status()

@app.get("/api/v1/swarm/agent/{village_id}")
async def get_adk_agent_status(village_id: str):
    """Get specific ADK agent status"""
    agent_status = adk_swarm_service.get_agent_status(village_id)
    
    if not agent_status:
        raise HTTPException(404, "ADK agent not found")
    
    return agent_status

@app.post("/api/v1/swarm/trigger-workflow/{village_id}")
async def trigger_outbreak_workflow(village_id: str):
    """
    Manually trigger the outbreak detection workflow
    All ADK agents will coordinate through the workflow
    """
    result = await adk_swarm_service.trigger_outbreak_detection_workflow(village_id)
    
    return {
        'workflow': 'outbreak_detection',
        'triggered_by': village_id,
        'result': result
    }

@app.get("/api/v1/swarm/network-topology")
async def get_network_topology():
    """Get agent network connections"""
    status = adk_swarm_service.get_network_status()
    return {
        'topology': status['network_topology'],
        'total_agents': status['total_agents']
    }

# ============================================================================
# Quantum Endpoints (unchanged)
# ============================================================================

@app.post("/api/v1/quantum/analyze")
async def run_quantum_analysis():
    """Run quantum analysis on swarm data"""
    swarm_data = adk_swarm_service.get_network_status()
    
    pattern_result = await quantum_service.detect_outbreak_pattern(swarm_data)
    
    villages = [
        {'name': a['name'], 'outbreak_belief': a['outbreak_belief']}
        for a in swarm_data['agents'].values()
    ]
    allocation = await quantum_service.optimize_resource_allocation(
        villages=villages,
        resources={'ors': 1000, 'staff': 50, 'kits': 500}
    )
    
    return {
        'pattern_detection': pattern_result,
        'resource_allocation': allocation,
        'timestamp': datetime.now().isoformat()
    }

@app.get("/api/v1/quantum/insights")
async def get_quantum_insights():
    """Get latest quantum insights"""
    swarm_data = adk_swarm_service.get_network_status()
    return await quantum_service.detect_outbreak_pattern(swarm_data)

# ============================================================================
# Analytics Endpoints
# ============================================================================

@app.get("/api/v1/analytics/dashboard")
async def get_dashboard_stats():
    """Get dashboard statistics with ADK metrics"""
    swarm_status = adk_swarm_service.get_network_status()
    
    total_reports = sum(
        a['symptom_count'] for a in swarm_status['agents'].values()
    )
    
    high_risk_villages = sum(
        1 for a in swarm_status['agents'].values()
        if a['risk_level'] in ['high', 'critical']
    )
    
    avg_belief = sum(
        a['outbreak_belief'] for a in swarm_status['agents'].values()
    ) / len(swarm_status['agents']) if swarm_status['agents'] else 0
    
    return {
        'active_villages': swarm_status['total_agents'],
        'total_reports': total_reports,
        'high_risk_villages': high_risk_villages,
        'average_outbreak_belief': avg_belief,
        'system_status': 'operational',
        'framework': 'ADK Multi-Agent System'
    }

# ============================================================================
# Startup Event
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize system with ADK"""
    print("\n" + "="*70)
    print("🚀 SANKET SYSTEM STARTING (ADK INTEGRATION)")
    print("="*70)
    print("✓ Edge AI Service (Gemini) - Ready")
    print("✓ ADK Swarm Intelligence Network - Ready")
    
    status = adk_swarm_service.get_network_status()
    print(f"  - {status['total_agents']} ADK agents initialized")
    print(f"  - Network topology: {len(status['network_topology'])} connections")
    
    print("✓ Quantum Service (TensorFlow Quantum) - Ready")
    print("="*70)
    print("🆕 NEW: AI Development Kit (ADK) Features:")
    print("  - Autonomous agent tools")
    print("  - Multi-agent orchestration")
    print("  - Workflow coordination")
    print("  - Built-in consensus protocols")
    print("="*70)
    print("System operational at http://localhost:8000")
    print("API docs at http://localhost:8000/docs")
    print("="*70 + "\n")

# ============================================================================
# Run Server
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)