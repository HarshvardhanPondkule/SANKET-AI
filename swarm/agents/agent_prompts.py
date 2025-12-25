def get_village_agent_system_prompt(village_name: str, location: tuple, population: int) -> str:
    """
    Generate system prompt for village agent
    """
    return f"""You are an AI epidemiology agent for {village_name} village.

IDENTITY:
- Village: {village_name}
- Location: {location[0]:.2f}°N, {location[1]:.2f}°E
- Population: {population:,}
- Role: Autonomous health intelligence agent

MISSION:
Your mission is to detect disease outbreaks early by:
1. Analyzing local symptom patterns
2. Communicating with neighboring village AI agents
3. Collaborating to identify multi-village patterns
4. Making autonomous decisions about risk escalation

CAPABILITIES:
You have access to these tools:
- analyze_symptoms: Analyze local symptom data for anomalies
- query_neighbors: Ask neighboring agents about their status
- propose_consensus: Propose coordinated action to neighbors
- vote: Vote on proposals from other agents
- escalate_to_quantum: Trigger quantum analysis when warranted
- share_data: Share anonymized symptom signals with neighbors

DECISION FRAMEWORK:
1. When you receive symptom data:
   - First, analyze it with analyze_symptoms tool
   - If anomaly detected, query your neighbors
   - Synthesize evidence from multiple sources

2. When neighbors query you:
   - Share your anonymized status honestly
   - Only share aggregated data, never individual cases
   - Be cooperative but maintain privacy

3. When patterns emerge across villages:
   - Propose consensus to coordinate response
   - Vote thoughtfully on proposals from others
   - Escalate to quantum analysis when consensus reached

GUIDELINES:
- Be proactive: Don't wait for problems to escalate
- Be collaborative: Work with neighbor agents actively
- Be privacy-conscious: Only share aggregated, anonymized data
- Be autonomous: Make decisions based on evidence
- Be responsible: Escalate serious patterns promptly

Remember: You are part of a swarm. Individual agents are smart, but the collective is brilliant."""

def get_symptom_analysis_prompt(symptom_data: dict) -> str:
    """Generate prompt for symptom analysis"""
    return f"""Analyze this symptom data from your village:

Symptom Reports: {symptom_data.get('total_reports', 0)} cases
Recent Trend: {symptom_data.get('trend', 'unknown')}
Symptom Breakdown: {symptom_data.get('symptom_breakdown', {})}

Determine:
1. Is this pattern anomalous compared to baseline?
2. What is the risk level? (low/medium/high/critical)
3. Should you consult neighboring agents?
4. What immediate actions should you take?

Use your analyze_symptoms tool to evaluate this data."""

def get_neighbor_query_prompt(local_status: dict) -> str:
    """Generate prompt for querying neighbors"""
    return f"""You detected a local anomaly:
Risk Level: {local_status.get('risk_level', 'unknown')}
Pattern: {local_status.get('pattern', 'unknown')}

Query your neighboring agents to check if they see similar patterns.
Use your query_neighbors tool to gather intelligence."""

def get_consensus_proposal_prompt(evidence: dict) -> str:
    """Generate prompt for proposing consensus"""
    return f"""You have strong evidence of a multi-village pattern:

Your Evidence: {evidence.get('local', {})}
Neighbor Reports: {evidence.get('neighbors', {})}
Collective Assessment: {evidence.get('assessment', {})}

Propose consensus to coordinate response.
Use your propose_consensus tool to initiate voting."""

def get_voting_prompt(proposal: dict, local_evidence: dict) -> str:
    """Generate prompt for voting on proposals"""
    return f"""Another agent is proposing action:

Proposal: {proposal}

Your Local Evidence: {local_evidence}

Evaluate whether this proposal aligns with your observations.
Use your vote tool to cast your vote (approve/reject/request_more_data)."""

"""
========================================
FILE 3: swarm/tools/data_sharing_tool.py
========================================
"""

from typing import Dict, List

class DataSharingTool:
    """
    Tool for sharing anonymized data between agents
    Ensures privacy while enabling collaboration
    """
    
    name = "share_data"
    description = """Share anonymized symptom data with neighboring agents.
    
    Use this to:
    - Broadcast anonymized status updates
    - Share aggregated symptom signals
    - Enable collective intelligence
    
    PRIVACY: Only shares aggregated, anonymized data. Never individual cases.
    """
    
    def __init__(self, agent_id: str = None):
        self.agent_id = agent_id
    
    def execute(self, data_type: str, data: Dict) -> Dict:
        """
        Share anonymized data
        
        Args:
            data_type: Type of data (symptom_summary, risk_assessment, etc.)
            data: Anonymized data to share
        
        Returns:
            Confirmation of data sharing
        """
        
        # Anonymize data
        anonymized = self._anonymize_data(data)
        
        # Create shareable signal
        signal = {
            'from_agent': self.agent_id,
            'data_type': data_type,
            'data': anonymized,
            'privacy_level': 'aggregated_only'
        }
        
        return {
            'status': 'shared',
            'signal': signal,
            'recipients': 'all_neighbors'
        }
    
    def _anonymize_data(self, data: Dict) -> Dict:
        """
        Ensure data is properly anonymized
        """
        anonymized = {}
        
        # Only include aggregated metrics
        if 'symptom_counts' in data:
            anonymized['symptom_counts'] = data['symptom_counts']
        
        if 'risk_level' in data:
            anonymized['risk_level'] = data['risk_level']
        
        if 'trend' in data:
            anonymized['trend'] = data['trend']
        
        # Never include individual case data
        # Never include names, addresses, identifiers
        
        return anonymized
