from dataclasses import dataclass
from typing import List, Dict

@dataclass
class AgentConfig:
    """Configuration for a village agent"""
    
    # Identity
    village_id: str
    village_name: str
    location: tuple  # (lat, lon)
    population: int
    
    # Gemini Model Settings
    model_name: str = "gemini-1.5-pro"
    temperature: float = 0.7
    max_tokens: int = 2048
    
    # Agent Behavior
    anomaly_threshold: float = 2.0  # Cases above baseline
    auto_query_neighbors: bool = True
    auto_escalate_on_consensus: bool = True
    
    # Consensus Settings
    consensus_threshold: float = 0.66  # 2/3 majority
    min_votes_required: int = 2
    
    # Privacy Settings
    anonymize_data: bool = True
    share_only_aggregated: bool = True
    
    # Tool Settings
    enable_all_tools: bool = True
    max_tool_calls: int = 10

# Predefined village configurations
VILLAGE_CONFIGS = {
    'v1': AgentConfig(
        village_id='v1',
        village_name='Dharavi',
        location=(19.04, 72.86),
        population=700000
    ),
    'v2': AgentConfig(
        village_id='v2',
        village_name='Kalyan',
        location=(19.24, 73.14),
        population=150000
    ),
    'v3': AgentConfig(
        village_id='v3',
        village_name='Thane',
        location=(19.22, 72.97),
        population=180000
    ),
    'v4': AgentConfig(
        village_id='v4',
        village_name='Navi Mumbai',
        location=(19.03, 73.01),
        population=120000
    )
}
