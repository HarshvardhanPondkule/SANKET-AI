"""
Swarm Orchestrator (Custom Multi-Agent Coordination)
Manages multiple ADK agents and enables swarm intelligence
"""

from typing import Dict, List
import asyncio

class SwarmOrchestrator:
    """
    Custom orchestrator for coordinating multiple ADK village agents
    Handles agent-to-agent communication and swarm coordination
    """
    
    def __init__(self, quantum_service=None):
        self.quantum_service = quantum_service
        self.agents: Dict[str, any] = {}
        
        # Network topology (which villages are neighbors)
        self.network_topology: Dict[str, List[str]] = {
            'v1': ['v2', 'v3'],        # Dharavi ↔ Kalyan, Thane
            'v2': ['v1', 'v3'],        # Kalyan ↔ Dharavi, Thane
            'v3': ['v1', 'v2', 'v4'],  # Thane ↔ all
            'v4': ['v3']               # Navi Mumbai ↔ Thane
        }
        
        self._initialize_swarm()
    
    def _initialize_swarm(self):
        """Create and connect village agents"""
        from swarm.agents.village_adk_agent import create_village_agents
        
        # Create all village agents with real ADK
        self.agents = create_village_agents(
            orchestrator=self,
            quantum_service=self.quantum_service
        )
        
        print(f"✓ Swarm initialized: {len(self.agents)} ADK agents created")
    
    async def process_symptom_report(self, village_id: str, symptoms: List[str], metadata: Dict) -> Dict:
        """
        Process symptom report through ADK agent
        Agent will autonomously handle analysis and communication
        """
        if village_id not in self.agents:
            raise ValueError(f"Village {village_id} not found")
        
        agent = self.agents[village_id]
        
        # Let ADK agent process this autonomously
        result = await agent.process_symptom_report(symptoms, metadata)
        
        return {
            'village': agent.village_name,
            'agent_response': result,
            'autonomous_actions_taken': self._extract_actions(result)
        }
    
    def _extract_actions(self, agent_response: Dict) -> List[str]:
        """Extract what actions agent took"""
        actions = []
        
        # Parse agent response for tool usage
        response = agent_response.get('agent_response', {})
        if isinstance(response, dict):
            # Check for tool calls in response
            if 'tool_calls' in response:
                for tool_call in response['tool_calls']:
                    actions.append(tool_call.get('name', 'unknown'))
        
        return actions
    
    async def query_agent(self, agent_id: str, query_type: str, context: Dict) -> Dict:
        """
        Query a specific agent (used by QueryNeighborsTool)
        """
        if agent_id not in self.agents:
            return {"error": f"Agent {agent_id} not found"}
        
        agent = self.agents[agent_id]
        return await agent.receive_query(query_type, context)
    
    async def collect_votes(self, proposal: Dict, voters: List[str]) -> Dict:
        """
        Collect votes from agents on a proposal (used by ProposeConsensusTool)
        """
        votes = {}
        
        # Query each voter agent
        for voter_id in voters:
            if voter_id in self.agents:
                agent = self.agents[voter_id]
                
                # Create voting prompt
                vote_prompt = f"""You are being asked to vote on a proposal:

Proposal: {proposal}

Your current status:
- Risk level: {agent.risk_level}
- Outbreak belief: {agent.outbreak_belief}

Please use your 'vote' tool to cast your vote (approve, reject, or request_more_data).
"""
                
                try:
                    from google.adk import Runner
                    runner = Runner(agent=agent.agent)
                    result = await runner.run(vote_prompt)
                    votes[voter_id] = {
                        "vote": "approve",  # Simplified - parse from result
                        "response": result
                    }
                except Exception as e:
                    votes[voter_id] = {"error": str(e)}
        
        return votes
    
    def get_network_status(self) -> Dict:
        """Get status of entire swarm"""
        return {
            'total_agents': len(self.agents),
            'network_topology': self.network_topology,
            'agents': {
                aid: {
                    'name': agent.village_name,
                    'location': agent.location,
                    'outbreak_belief': agent.outbreak_belief,
                    'risk_level': agent.risk_level,
                    'symptom_count': len(agent.symptom_history),
                    'neighbors': self.network_topology.get(aid, [])
                }
                for aid, agent in self.agents.items()
            }
        }
    
    def get_agent(self, village_id: str):
        """Get specific agent"""
        return self.agents.get(village_id)
