from fastapi import APIRouter, HTTPException
from app.services.adk_swarm_service import adk_swarm_service

router = APIRouter()

@router.get("/agents")
async def get_agents():
    """Get all swarm agents status"""
    return adk_swarm_service.get_network_status()

@router.get("/anomalies/{village_id}")
async def detect_anomalies(village_id: str):
    """Check if village agent detected anomalies"""
    agent = adk_swarm_service.orchestrator.agents.get(village_id)
    if not agent:
        raise HTTPException(404, "Agent not found")
    
    return {
        'village': agent.name,
        'outbreak_belief': agent.outbreak_belief,
        'risk_level': agent.risk_level,
        'neighbor_signals': len(agent.neighbor_reports)
    }