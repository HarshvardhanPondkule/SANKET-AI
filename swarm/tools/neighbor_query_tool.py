"""
ADK Tool: Query Neighbors (Real ADK API)
Agent uses this for AI-to-AI communication
"""

from google.adk.tools import BaseTool
from typing import Any
from pydantic import BaseModel, Field

class NeighborQueryInput(BaseModel):
    """Input schema for neighbor queries"""
    neighbor_ids: list[str] = Field(description="IDs of neighbor agents to query")
    query_type: str = Field(description="Type of query: symptom_status, risk_assessment, or recent_activity")
    context: dict = Field(default_factory=dict, description="Context for the query")

class QueryNeighborsTool(BaseTool):
    """
    Tool for querying neighboring village agents
    Enables AI-to-AI communication
    """
    
    input_schema: type[BaseModel] = NeighborQueryInput
    
    def __init__(self, orchestrator=None, **kwargs):
        super().__init__(
            name="query_neighbors",
            description="""Query neighboring village AI agents for their current status.
    
Use this tool to:
- Ask neighbors about their symptom patterns
- Check if neighbors see similar trends
- Gather collective intelligence
- Enable swarm reasoning

Input: List of neighbor agent IDs and query type
Output: Responses from all queried neighbors
""",
            **kwargs
        )
        self.orchestrator = orchestrator
    
    async def run(self, neighbor_ids: list[str], query_type: str, context: dict = None, **kwargs) -> dict[str, Any]:
        """
        Execute neighbor query (AI-to-AI communication)
        """
        if not self.orchestrator:
            return {"error": "Orchestrator not configured", "queries_sent": 0}
        
        # Query each neighbor agent through orchestrator
        responses = {}
        for neighbor_id in neighbor_ids:
            try:
                response = await self.orchestrator.query_agent(
                    agent_id=neighbor_id,
                    query_type=query_type,
                    context=context
                )
                responses[neighbor_id] = response
            except Exception as e:
                responses[neighbor_id] = {"error": str(e)}
        
        return {
            "queries_sent": len(neighbor_ids),
            "responses": responses,
            "patterns_detected": self._analyze_responses(responses)
        }
    
    def _analyze_responses(self, responses: dict) -> dict:
        """Analyze collective responses from neighbors"""
        risk_levels = []
        anomalies = 0
        
        for neighbor_id, response in responses.items():
            if isinstance(response, dict):
                if response.get('risk_level'):
                    risk_levels.append(response['risk_level'])
                if response.get('anomaly_detected'):
                    anomalies += 1
        
        return {
            "neighbors_with_anomalies": anomalies,
            "collective_risk": self._calculate_collective_risk(risk_levels),
            "correlation_detected": anomalies > len(responses) / 2 if responses else False
        }
    
    def _calculate_collective_risk(self, risk_levels: list[str]) -> str:
        """Calculate collective risk from neighbor responses"""
        if not risk_levels:
            return "unknown"
        
        risk_scores = {"low": 1, "medium": 2, "high": 3, "critical": 4}
        avg_score = sum(risk_scores.get(r, 1) for r in risk_levels) / len(risk_levels)
        
        if avg_score > 3:
            return "critical"
        elif avg_score > 2:
            return "high"
        elif avg_score > 1.5:
            return "medium"
        return "low"
