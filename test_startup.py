"""
Test startup script to debug initialization
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("1. Testing quantum service...")
from backend.app.services.quantum_service import QuantumService
quantum_service = QuantumService()
print("✓ Quantum service initialized")

print("\n2. Testing edge AI service...")
from backend.app.services.edge_ai_service import GeminiEdgeProcessor
gemini_processor = GeminiEdgeProcessor(api_key="test-key")
print("✓ Edge AI service initialized")

print("\n3. Testing swarm orchestrator...")
from swarm.orchestrator.swarm_orchestrator import SwarmOrchestrator
orchestrator = SwarmOrchestrator(quantum_service=quantum_service)
print(f"✓ Swarm orchestrator initialized with {len(orchestrator.agents)} agents")

print("\n4. Testing ADK swarm service...")
from backend.app.services.adk_swarm_service import ADKSwarmService
adk_service = ADKSwarmService(quantum_service=quantum_service)
print("✓ ADK swarm service initialized")

print("\n5. Getting network status...")
status = adk_service.get_network_status()
print(f"✓ Network status: {status['total_agents']} agents active")

print("\n✅ ALL SERVICES INITIALIZED SUCCESSFULLY!")
print("\nAgent details:")
for agent_id, agent_info in status['agents'].items():
    print(f"  - {agent_info['name']}: {agent_info['risk_level']} risk")
