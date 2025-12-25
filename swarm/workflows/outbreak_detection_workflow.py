"""
🆕 ADK Workflow: Outbreak Detection
Defines the coordinated workflow for swarm agents
"""

from google.adk import Workflow, WorkflowStep

class OutbreakDetectionWorkflow(Workflow):
    """
    Multi-agent workflow for outbreak detection
    Coordinates agent actions in sequence
    """
    
    name = "outbreak_detection"
    description = "Coordinated workflow for detecting disease outbreaks"
    
    steps = [
        WorkflowStep(
            name="local_analysis",
            description="Each agent analyzes its local data",
            agent_action="analyze_symptoms",
            parallel=True,  # All agents do this simultaneously
            timeout=30
        ),
        
        WorkflowStep(
            name="neighbor_consultation",
            description="Agents query neighbors if anomaly detected",
            agent_action="query_neighbors",
            condition="anomaly_detected == true",  # Only if anomaly
            parallel=True,
            timeout=60
        ),
        
        WorkflowStep(
            name="collective_reasoning",
            description="Agents synthesize neighbor responses",
            agent_action="reason_about_collective_evidence",
            depends_on=["neighbor_consultation"],
            parallel=True,
            timeout=45
        ),
        
        WorkflowStep(
            name="consensus_proposal",
            description="Agent with strongest evidence proposes action",
            agent_action="propose_consensus",
            agent_selector="max_outbreak_belief",  # Agent with highest belief
            timeout=30
        ),
        
        WorkflowStep(
            name="voting",
            description="All agents vote on proposal",
            agent_action="vote",
            depends_on=["consensus_proposal"],
            parallel=True,
            timeout=60
        ),
        
        WorkflowStep(
            name="quantum_escalation",
            description="Escalate to quantum if consensus reached",
            agent_action="escalate_to_quantum",
            condition="consensus_reached == true",
            agent_selector="proposer",  # Original proposing agent
            timeout=120
        )
    ]
    
    def __init__(self, orchestrator):
        super().__init__()
        self.orchestrator = orchestrator
    
    async def execute(self, trigger_data: Dict) -> Dict:
        """
        Execute the workflow
        ADK orchestrator coordinates all steps
        """
        result = await self.orchestrator.run_workflow(
            workflow=self,
            initial_data=trigger_data
        )
        
        return result