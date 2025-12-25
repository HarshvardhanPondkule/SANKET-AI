"""
ADK-Powered Village Agent (Real Google ADK API)
Each village has an autonomous ADK agent with tools
"""

from google.adk import Agent
from swarm.tools.symptom_analysis_tool import AnalyzeSymptomsToolTool
from swarm.tools.neighbor_query_tool import QueryNeighborsTool
from swarm.tools.consensus_tool import ProposeConsensusTool, VoteTool
from swarm.tools.quantum_escalation_tool import EscalateToQuantumTool
from swarm.tools.data_sharing_tool import ShareDataTool

class VillageADKAgent:
    """
    ADK-powered autonomous village agent using real Google ADK
    """
    
    def __init__(self, village_id: str, village_name: str, location: tuple, 
                 orchestrator=None, quantum_service=None):
        self.village_id = village_id
        self.village_name = village_name
        self.location = location
        
        # Local state
        self.symptom_history = []
        self.outbreak_belief = 0.0
        self.risk_level = "normal"
        
        # Create tools with dependencies
        self.tools = [
            AnalyzeSymptomsToolTool(),
            QueryNeighborsTool(orchestrator=orchestrator),
            ProposeConsensusTool(orchestrator=orchestrator),
            VoteTool(),
            EscalateToQuantumTool(quantum_service=quantum_service),
            ShareDataTool(agent_id=village_id)
        ]
        
        # Create real ADK agent
        self.agent = Agent(
            name=f"{village_name.replace(' ', '_')}_agent",  # No spaces allowed
            description=f"Epidemiology AI agent for {village_name} village",
            instruction=self._create_instruction(),
            model="gemini-1.5-flash",  # Using flash for faster responses
            tools=self.tools
        )
    
    def _create_instruction(self) -> str:
        """Create instruction for this agent"""
        return f"""You are an AI epidemiology agent for {self.village_name} village.

ROLE:
- Analyze symptom patterns in your village
- Communicate with neighboring village AI agents
- Collaborate to detect disease outbreaks early
- Make autonomous decisions about risk escalation

YOUR TOOLS:
1. analyze_symptoms: Analyze local symptom data for anomalies
2. query_neighbors: Ask neighboring agents for their status
3. propose_consensus: Propose action to neighbor agents for voting
4. vote: Vote on proposals from other agents
5. escalate_to_quantum: Trigger quantum analysis when consensus reached
6. share_data: Share anonymized symptom signals with neighbors

GUIDELINES:
- Maintain privacy: only share aggregated, anonymized data
- Be proactive: query neighbors when you detect anomalies
- Collaborate: work with neighbor agents to reach consensus
- Act autonomously: make decisions based on evidence
- Escalate wisely: trigger quantum analysis only when warranted

LOCATION: {self.location}
VILLAGE: {self.village_name}

When you receive symptom reports, analyze them and decide what actions to take.
"""
    
    async def process_symptom_report(self, symptoms: list, metadata: dict):
        """
        Process new symptom report
        ADK agent will autonomously decide what to do
        """
        self.symptom_history.append({
            'symptoms': symptoms,
            'metadata': metadata,
            'timestamp': metadata.get('timestamp', 'unknown')
        })
        
        # Create prompt for ADK agent
        prompt = f"""New symptom report received in {self.village_name}:

Symptoms: {', '.join(symptoms)}
Metadata: {metadata}

Current Status:
- Total reports in history: {len(self.symptom_history)}
- Recent trend: {self._get_trend()}
- Current risk level: {self.risk_level}

Please analyze this report and decide what actions to take:
1. Should you analyze symptoms for anomalies?
2. If anomaly detected, should you query neighbor agents?
3. Should you propose consensus for escalation?

Use your tools to analyze and communicate as needed.
"""
        
        # Run ADK agent
        from google.adk import Runner
        runner = Runner(agent=self.agent)
        
        try:
            result = await runner.run(prompt)
            
            # Update local state based on analysis
            self._update_state_from_result(result)
            
            return {
                "agent_response": result,
                "village": self.village_name,
                "updated_risk_level": self.risk_level,
                "updated_outbreak_belief": self.outbreak_belief
            }
        except Exception as e:
            return {
                "error": str(e),
                "village": self.village_name
            }
    
    async def receive_query(self, query_type: str, context: dict):
        """
        Receive query from another agent
        """
        prompt = f"""Another agent is querying you about: {query_type}

Context: {context}

Your current status:
- Risk level: {self.risk_level}
- Outbreak belief: {self.outbreak_belief}
- Total symptom reports: {len(self.symptom_history)}
- Recent trend: {self._get_trend()}

Please provide a helpful response based on your local data.
"""
        
        from google.adk import Runner
        runner = Runner(agent=self.agent)
        
        try:
            result = await runner.run(prompt)
            return {
                "response": result,
                "risk_level": self.risk_level,
                "anomaly_detected": self.risk_level in ['high', 'critical'],
                "outbreak_belief": self.outbreak_belief
            }
        except Exception as e:
            return {"error": str(e)}
    
    def _get_trend(self) -> str:
        """Get recent symptom trend"""
        if len(self.symptom_history) > 5:
            return "increasing"
        elif len(self.symptom_history) > 2:
            return "stable"
        return "low_activity"
    
    def _update_state_from_result(self, result):
        """Update agent state based on analysis results"""
        # Simple heuristic - in production, parse tool results
        if len(self.symptom_history) > 10:
            self.risk_level = "high"
            self.outbreak_belief = 0.8
        elif len(self.symptom_history) > 5:
            self.risk_level = "medium"
            self.outbreak_belief = 0.5
        else:
            self.risk_level = "low"
            self.outbreak_belief = 0.2


def create_village_agents(orchestrator=None, quantum_service=None) -> dict:
    """
    Factory function to create all village agents with real ADK
    """
    villages = [
        ("v1", "Dharavi", (19.04, 72.86)),
        ("v2", "Kalyan", (19.24, 73.14)),
        ("v3", "Thane", (19.22, 72.97)),
        ("v4", "Navi Mumbai", (19.03, 73.01))
    ]
    
    agents = {}
    for vid, vname, location in villages:
        agents[vid] = VillageADKAgent(
            vid, vname, location,
            orchestrator=orchestrator,
            quantum_service=quantum_service
        )
    
    return agents
