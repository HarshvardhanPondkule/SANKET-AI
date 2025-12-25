"""
ADK Tool: Data Sharing (Real ADK API)
Agent uses this to share anonymized data with neighbors
"""

from google.adk.tools import BaseTool
from typing import Any
from pydantic import BaseModel, Field
import hashlib
from datetime import datetime

class DataSharingInput(BaseModel):
    """Input schema for data sharing"""
    data_type: str = Field(description="Type of data to share: symptom_summary, risk_assessment, or trend_data")
    neighbor_ids: list[str] = Field(description="Neighbors to share with")
    aggregation_level: str = Field(default="daily", description="Level of aggregation: daily, weekly, or real_time")

class ShareDataTool(BaseTool):
    """
    Tool for sharing anonymized symptom data with neighbors
    Maintains privacy while enabling collaboration
    """
    
    input_schema: type[BaseModel] = DataSharingInput
    
    def __init__(self, agent_id: str = None, **kwargs):
        super().__init__(
            name="share_data",
            description="""Share anonymized symptom signals with neighboring agents.
    
Use this tool to:
- Share aggregated symptom patterns (not individual cases)
- Maintain patient privacy
- Enable collective intelligence
- Support neighbor analysis

All data is automatically anonymized before sharing.
""",
            **kwargs
        )
        self.agent_id = agent_id
    
    async def run(self, data_type: str, neighbor_ids: list[str], aggregation_level: str = "daily", **kwargs) -> dict[str, Any]:
        """
        Share anonymized data with neighbors
        """
        # Get local data to share
        local_data = self._get_local_data(data_type)
        
        # Anonymize
        anonymized_data = self._anonymize_data(local_data)
        
        # Create sharing package
        share_package = {
            "from_agent": self._hash_agent_id(self.agent_id),
            "data_type": data_type,
            "aggregation_level": aggregation_level,
            "data": anonymized_data,
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "shared_with": neighbor_ids,
            "data_type": data_type,
            "privacy_level": "anonymized",
            "share_package": share_package
        }
    
    def _get_local_data(self, data_type: str) -> dict:
        """Get local data based on type"""
        if data_type == "symptom_summary":
            return {
                "total_cases": 15,
                "dominant_symptoms": ["fever", "headache"],
                "trend": "increasing"
            }
        elif data_type == "risk_assessment":
            return {
                "risk_level": "medium",
                "confidence": 0.75
            }
        else:
            return {
                "trend": "stable"
            }
    
    def _anonymize_data(self, data: dict) -> dict:
        """Anonymize data before sharing"""
        anonymized = data.copy()
        
        if "total_cases" in anonymized:
            cases = anonymized["total_cases"]
            if cases < 10:
                anonymized["total_cases"] = "< 10"
            elif cases < 50:
                anonymized["total_cases"] = "10-50"
            else:
                anonymized["total_cases"] = "> 50"
        
        return anonymized
    
    def _hash_agent_id(self, agent_id: str) -> str:
        """Hash agent ID for privacy"""
        if not agent_id:
            return "anonymous"
        return hashlib.sha256(agent_id.encode()).hexdigest()[:8]
