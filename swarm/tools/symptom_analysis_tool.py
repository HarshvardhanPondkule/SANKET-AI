"""
ADK Tool: Symptom Analysis (Real ADK API)
Agent uses this to analyze local symptom patterns
"""

from google.adk.tools import BaseTool
from typing import Any
from pydantic import BaseModel, Field

class SymptomAnalysisInput(BaseModel):
    """Input schema for symptom analysis"""
    symptom_reports: list[dict] = Field(description="Recent symptom reports to analyze")
    baseline_threshold: float = Field(default=2.0, description="Normal baseline for comparison")

class AnalyzeSymptomsToolTool(BaseTool):
    """
    Tool for analyzing symptom patterns in village data
    Uses real Google ADK BaseTool
    """
    
    input_schema: type[BaseModel] = SymptomAnalysisInput
    
    def __init__(self, **kwargs):
        super().__init__(
            name="analyze_symptoms",
            description="""Analyze symptom patterns in local village data.
    
Use this tool to:
- Detect anomalies in symptom reports
- Identify disease patterns
- Calculate risk levels
- Determine if further investigation needed

Input: List of recent symptom reports
Output: Analysis with anomaly detection and risk assessment
""",
            **kwargs
        )
    
    async def run(self, symptom_reports: list[dict], baseline_threshold: float = 2.0, **kwargs) -> dict[str, Any]:
        """
        Execute symptom analysis (ADK tool execution method)
        """
        # Count symptom occurrences
        symptom_counts = {}
        for report in symptom_reports:
            for symptom in report.get('symptoms', []):
                symptom_counts[symptom] = symptom_counts.get(symptom, 0) + 1
        
        # Detect anomaly
        total_cases = len(symptom_reports)
        anomaly_detected = total_cases > baseline_threshold
        
        # Calculate risk
        if total_cases > baseline_threshold * 3:
            risk_level = "high"
        elif total_cases > baseline_threshold * 1.5:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        # Identify dominant pattern
        dominant_symptom = max(symptom_counts.items(), key=lambda x: x[1])[0] if symptom_counts else None
        
        return {
            "anomaly_detected": anomaly_detected,
            "risk_level": risk_level,
            "total_cases": total_cases,
            "symptom_breakdown": symptom_counts,
            "dominant_pattern": dominant_symptom,
            "recommendation": "query_neighbors" if anomaly_detected else "continue_monitoring"
        }
