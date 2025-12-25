from quantum.cirq_integration import QuantumService as CirqQuantumService
from typing import Dict, List

class QuantumService:
    """
    Quantum service wrapper using Cirq
    """
    
    def __init__(self):
        self.cirq_service = CirqQuantumService()
    
    async def analyze_outbreak_pattern(self, swarm_data: Dict) -> Dict:
        """
        Called when swarm reaches consensus
        Uses quantum circuits to amplify weak patterns
        """
        return await self.cirq_service.analyze_outbreak_pattern(swarm_data)
    
    async def detect_outbreak_pattern(self, swarm_data: Dict) -> Dict:
        """Alias for analyze_outbreak_pattern"""
        return await self.analyze_outbreak_pattern(swarm_data)
    
    async def optimize_resource_allocation(self, villages: List[Dict], resources: Dict) -> List[Dict]:
        """
        Optimize resource allocation using quantum-inspired algorithm
        """
        return await self.cirq_service.optimize_resource_allocation(villages, resources)

quantum_service = QuantumService()