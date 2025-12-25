"""
ADK Tool: Consensus Protocol (Real ADK API)
Agents use this for distributed decision making
"""

from google.adk.tools import BaseTool
from typing import Any
from pydantic import BaseModel, Field

class ConsensusProposalInput(BaseModel):
    """Input schema for consensus proposals"""
    proposal: dict = Field(description="The action being proposed")
    neighbor_ids: list[str] = Field(description="Neighbors to vote")

class VoteInput(BaseModel):
    """Input schema for voting"""
    proposal: dict = Field(description="Proposal to vote on")
    local_evidence: dict = Field(default_factory=dict, description="Your local data for comparison")

class ProposeConsensusTool(BaseTool):
    """
    Tool for proposing actions to neighbor agents
    Initiates distributed consensus
    """
    
    input_schema: type[BaseModel] = ConsensusProposalInput
    
    def __init__(self, orchestrator=None, **kwargs):
        super().__init__(
            name="propose_consensus",
            description="""Propose an action to neighboring agents and collect votes.
    
Use this when:
- You detect a significant pattern
- Multiple agents should coordinate response
- Collective decision needed before escalation

This initiates a voting round among all connected agents.
""",
            **kwargs
        )
        self.orchestrator = orchestrator
    
    async def run(self, proposal: dict, neighbor_ids: list[str], **kwargs) -> dict[str, Any]:
        """
        Propose action and collect votes from neighbors
        """
        if not self.orchestrator:
            return {"error": "Orchestrator not configured"}
        
        # Send proposal to all neighbors through orchestrator
        votes = await self.orchestrator.collect_votes(
            proposal=proposal,
            voters=neighbor_ids
        )
        
        # Evaluate consensus
        total_votes = len(votes)
        approve_votes = sum(1 for v in votes.values() if v.get('vote') == 'approve')
        
        consensus_reached = approve_votes / total_votes >= 0.66 if total_votes > 0 else False
        
        return {
            "proposal_id": proposal.get('id', 'unknown'),
            "total_votes": total_votes,
            "approve_votes": approve_votes,
            "consensus_reached": consensus_reached,
            "consensus_strength": approve_votes / total_votes if total_votes > 0 else 0,
            "votes": votes
        }


class VoteTool(BaseTool):
    """
    Tool for voting on proposals from other agents
    """
    
    input_schema: type[BaseModel] = VoteInput
    
    def __init__(self, **kwargs):
        super().__init__(
            name="vote",
            description="""Vote on a proposal from another agent.
    
Evaluate the proposal based on:
- Your local evidence
- Alignment with your observations
- Risk assessment

Vote: approve, reject, or request_more_data
""",
            **kwargs
        )
    
    async def run(self, proposal: dict, local_evidence: dict = None, **kwargs) -> dict[str, Any]:
        """
        Evaluate proposal and cast vote
        """
        proposal_action = proposal.get('action', '')
        local_evidence = local_evidence or {}
        
        # Simple evaluation logic
        if proposal_action == 'escalate_to_quantum':
            local_risk = local_evidence.get('risk_level', 'low')
            
            if local_risk in ['high', 'critical']:
                vote = 'approve'
                confidence = 0.9
            elif local_risk == 'medium':
                vote = 'approve'
                confidence = 0.6
            else:
                vote = 'request_more_data'
                confidence = 0.4
        else:
            vote = 'approve'
            confidence = 0.5
        
        return {
            "vote": vote,
            "confidence": confidence,
            "reasoning": f"Local risk level is {local_evidence.get('risk_level', 'unknown')}",
            "local_evidence": local_evidence
        }
