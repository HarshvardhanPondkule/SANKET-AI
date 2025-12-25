from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
import json

router = APIRouter(prefix="/edge", tags=["Edge AI"])

# This will be injected from main.py
edge_ai_service = None
swarm_service = None

def set_services(edge_service, swarm_svc):
    """Set service dependencies"""
    global edge_ai_service, swarm_service
    edge_ai_service = edge_service
    swarm_service = swarm_svc

@router.post("/submit-report")
async def submit_symptom_report(
    village_id: str = Form(...),
    symptoms: str = Form(...),  # JSON string
    voice: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
    metadata: Optional[str] = Form(None)
):
    """
    Submit symptom report from ASHA worker
    
    Supports multimodal input:
    - Voice recording
    - Image (rash, environment)
    - Text symptoms
    - Metadata
    """
    
    if not edge_ai_service or not swarm_service:
        raise HTTPException(500, "Services not initialized")
    
    # Parse JSON inputs
    try:
        symptoms_list = json.loads(symptoms)
        metadata_dict = json.loads(metadata) if metadata else {}
    except:
        raise HTTPException(400, "Invalid JSON in symptoms or metadata")
    
    # Read file data
    voice_data = await voice.read() if voice else None
    image_data = await image.read() if image else None
    
    # Process with Edge AI (Gemini)
    edge_result = await edge_ai_service.process_multimodal_report(
        voice_data=voice_data,
        image_data=image_data,
        text_symptoms=symptoms_list,
        metadata=metadata_dict
    )
    
    # Send to Swarm
    swarm_result = await swarm_service.process_symptom_report(
        village_id=village_id,
        symptoms=edge_result['combined_symptoms'],
        metadata={
            'edge_analysis': edge_result,
            'original_metadata': metadata_dict
        }
    )
    
    return {
        'status': 'success',
        'village_id': village_id,
        'edge_analysis': edge_result,
        'swarm_response': swarm_result
    }

@router.post("/process-voice")
async def process_voice_only(
    audio: UploadFile = File(...),
    language: str = Form("hi-IN")
):
    """Process voice input only"""
    
    if not edge_ai_service:
        raise HTTPException(500, "Edge AI service not initialized")
    
    audio_data = await audio.read()
    result = await edge_ai_service.processor.process_voice(audio_data, language)
    
    return result

@router.post("/process-image")
async def process_image_only(image: UploadFile = File(...)):
    """Process image only"""
    
    if not edge_ai_service:
        raise HTTPException(500, "Edge AI service not initialized")
    
    image_data = await image.read()
    result = await edge_ai_service.processor.process_image(image_data)
    
    return result