from dataclasses import dataclass
from typing import Dict, List, Optional
from datetime import datetime
from enum import Enum
import uuid

class MessageType(Enum):
    """Types of messages agents can exchange"""
    QUERY = "query"
    RESPONSE = "response"
    PROPOSAL = "proposal"
    VOTE = "vote"
    ALERT = "alert"
    STATUS_UPDATE = "status_update"

@dataclass
class AgentMessage:
    """Message exchanged between agents"""
    
    message_id: str
    message_type: MessageType
    sender_id: str
    receiver_id: str  # or "broadcast"
    content: Dict
    timestamp: datetime
    ttl: int = 3  # Time-to-live for propagation
    
    def to_dict(self) -> Dict:
        return {
            'message_id': self.message_id,
            'message_type': self.message_type.value,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
            'ttl': self.ttl
        }

class CommunicationProtocol:
    """
    Protocol for agent-to-agent communication
    Ensures reliable message delivery and consensus
    """
    
    def __init__(self):
        self.message_queue: Dict[str, List[AgentMessage]] = {}
        self.message_history: List[AgentMessage] = []
    
    def route_message(self, message: AgentMessage, agents: Dict) -> List[str]:
        """
        Route message to appropriate agents
        
        Returns list of agent IDs message was sent to
        """
        recipients = []
        
        if message.receiver_id == "broadcast":
            # Send to all agents except sender
            recipients = [aid for aid in agents.keys() if aid != message.sender_id]
        else:
            # Send to specific agent
            if message.receiver_id in agents:
                recipients = [message.receiver_id]
        
        # Add to each recipient's queue
        for recipient_id in recipients:
            if recipient_id not in self.message_queue:
                self.message_queue[recipient_id] = []
            self.message_queue[recipient_id].append(message)
        
        # Store in history
        self.message_history.append(message)
        
        return recipients
    
    def get_messages_for_agent(self, agent_id: str) -> List[AgentMessage]:
        """
        Get all pending messages for an agent
        """
        messages = self.message_queue.get(agent_id, [])
        
        # Clear queue
        self.message_queue[agent_id] = []
        
        return messages
    
    def create_query_message(
        self,
        sender_id: str,
        receiver_id: str,
        query_content: Dict
    ) -> AgentMessage:
        """Create a query message"""
        
        return AgentMessage(
            message_id=str(uuid.uuid4()),
            message_type=MessageType.QUERY,
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=query_content,
            timestamp=datetime.now()
        )
    
    def create_response_message(
        self,
        sender_id: str,
        receiver_id: str,
        response_content: Dict,
        original_message_id: str
    ) -> AgentMessage:
        """Create a response message"""
        
        return AgentMessage(
            message_id=str(uuid.uuid4()),
            message_type=MessageType.RESPONSE,
            sender_id=sender_id,
            receiver_id=receiver_id,
            content={
                'response': response_content,
                'in_reply_to': original_message_id
            },
            timestamp=datetime.now()
        )
