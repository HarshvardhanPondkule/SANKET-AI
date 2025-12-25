from fastapi import APIRouter
from app.services.quantum_service import quantum_service
from app.services.swarm_service import swarm_service

router = APIRouter()

@router.post("/analyze")
async def run_quantum_analysis():
    """
    Triggered by swarm consensus
    Runs quantum pattern detection and optimization
    """
    # Get swarm data
    swarm_data = await swarm_service.get_network_status()
    
    # Run quantum analysis
    quantum_result = await quantum_service.analyze_outbreak_pattern(swarm_data)
    
    return quantum_result