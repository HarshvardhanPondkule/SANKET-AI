from typing import Dict, List
from datetime import datetime
import uuid

class ConsensusWorkflow:
    """
    Workflow for distributed consensus among agents
    Implements Raft-inspired consensus protocol
    """
    
    def __init__(self):
        self.active_proposals: Dict[str, Dict] = {}
    
    async def initiate_consensus(
        self,
        proposer_id: str,
        proposal: Dict,
        eligible_voters: List[str]
    ) -> str:
        """
        Initiate consensus round
        
        Returns proposal_id
        """
        
        proposal_id = str(uuid.uuid4())
        
        self.active_proposals[proposal_id] = {
            'id': proposal_id,
            'proposer': proposer_id,
            'proposal': proposal,
            'eligible_voters': eligible_voters,
            'votes': {},
            'status': 'voting',
            'created_at': datetime.now(),
            'consensus_reached': False
        }
        
        return proposal_id
    
    def cast_vote(
        self,
        proposal_id: str,
        voter_id: str,
        vote: str,
        confidence: float
    ) -> bool:
        """
        Cast a vote on a proposal
        
        Returns True if vote accepted
        """
        if proposal_id not in self.active_proposals:
            return False
        
        proposal_state = self.active_proposals[proposal_id]
        
        if voter_id not in proposal_state['eligible_voters']:
            return False
        
        if proposal_state['status'] != 'voting':
            return False
        
        # Record vote
        proposal_state['votes'][voter_id] = {
            'vote': vote,
            'confidence': confidence,
            'timestamp': datetime.now()
        }
        
        # Check if all votes collected
        if len(proposal_state['votes']) == len(proposal_state['eligible_voters']):
            self._evaluate_consensus(proposal_id)
        
        return True
    
    def _evaluate_consensus(self, proposal_id: str):
        """
        Evaluate if consensus has been reached
        """
        proposal_state = self.active_proposals[proposal_id]
        votes = proposal_state['votes']
        
        # Count votes
        total_votes = len(votes)
        approve_votes = sum(1 for v in votes.values() if v['vote'] == 'approve')
        
        # Calculate consensus
        approval_rate = approve_votes / total_votes if total_votes > 0 else 0
        
        # Consensus threshold (2/3 majority)
        consensus_threshold = 0.66
        
        if approval_rate >= consensus_threshold:
            proposal_state['consensus_reached'] = True
            proposal_state['status'] = 'approved'
        else:
            proposal_state['consensus_reached'] = False
            proposal_state['status'] = 'rejected'
        
        proposal_state['approval_rate'] = approval_rate
        proposal_state['evaluated_at'] = datetime.now()
    
    def get_proposal_status(self, proposal_id: str) -> Dict:
        """Get current status of a proposal"""
        return self.active_proposals.get(proposal_id, {})
    
    def is_consensus_reached(self, proposal_id: str) -> bool:
        """Check if consensus was reached"""
        proposal = self.active_proposals.get(proposal_id, {})
        return proposal.get('consensus_reached', False)
