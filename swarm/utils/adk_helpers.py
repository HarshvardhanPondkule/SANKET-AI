from typing import Dict, List, Any
import json

def format_tool_result(tool_name: str, result: Any) -> Dict:
    """
    Format tool execution result for ADK
    """
    return {
        'tool': tool_name,
        'result': result,
        'status': 'success' if result else 'failed'
    }

def parse_agent_response(response: str) -> Dict:
    """
    Parse agent response to extract structured data
    """
    try:
        # Try to parse as JSON
        return json.loads(response)
    except:
        # Return as text if not JSON
        return {'response': response}

def create_agent_context(village_data: Dict) -> str:
    """
    Create context string for agent from village data
    """
    context = f"""
    Village: {village_data.get('name', 'Unknown')}
    Current Status:
    - Risk Level: {village_data.get('risk_level', 'normal')}
    - Outbreak Belief: {village_data.get('outbreak_belief', 0.0):.2f}
    - Recent Cases: {village_data.get('symptom_count', 0)}
    """
    return context.strip()

def aggregate_swarm_intelligence(agent_responses: List[Dict]) -> Dict:
    """
    Aggregate intelligence from multiple agents
    """
    total_agents = len(agent_responses)
    
    if total_agents == 0:
        return {
            'collective_risk': 'unknown',
            'consensus_strength': 0.0,
            'anomaly_count': 0
        }
    
    # Calculate collective metrics
    risk_levels = [r.get('risk_level', 'low') for r in agent_responses]
    beliefs = [r.get('outbreak_belief', 0.0) for r in agent_responses]
    
    risk_score_map = {'low': 1, 'medium': 2, 'high': 3, 'critical': 4}
    avg_risk_score = sum(risk_score_map.get(r, 1) for r in risk_levels) / total_agents
    
    if avg_risk_score > 3:
        collective_risk = 'critical'
    elif avg_risk_score > 2:
        collective_risk = 'high'
    elif avg_risk_score > 1.5:
        collective_risk = 'medium'
    else:
        collective_risk = 'low'
    
    avg_belief = sum(beliefs) / total_agents
    anomaly_count = sum(1 for r in agent_responses if r.get('anomaly_detected', False))
    
    return {
        'collective_risk': collective_risk,
        'consensus_strength': avg_belief,
        'anomaly_count': anomaly_count,
        'total_agents': total_agents,
        'high_risk_agents': sum(1 for r in risk_levels if r in ['high', 'critical'])
    }

def validate_agent_message(message: Dict) -> bool:
    """
    Validate agent message format
    """
    required_fields = ['sender_id', 'message_type', 'content']
    return all(field in message for field in required_fields)

def calculate_network_health(agents: Dict) -> Dict:
    """
    Calculate overall health of swarm network
    """
    total_agents = len(agents)
    
    if total_agents == 0:
        return {'status': 'no_agents', 'health_score': 0.0}
    
    active_agents = sum(1 for a in agents.values() if a.get('active', False))
    high_risk = sum(1 for a in agents.values() if a.get('risk_level') in ['high', 'critical'])
    
    health_score = (active_agents / total_agents) * (1 - (high_risk / total_agents))
    
    if health_score > 0.8:
        status = 'healthy'
    elif health_score > 0.5:
        status = 'moderate'
    else:
        status = 'critical'
    
    return {
        'status': status,
        'health_score': health_score,
        'active_agents': active_agents,
        'total_agents': total_agents,
        'high_risk_count': high_risk
    }
