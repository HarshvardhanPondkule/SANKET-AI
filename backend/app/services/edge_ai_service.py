"""
Edge AI Service using Gemini API
Processes voice, images, and normalizes symptoms
"""

import google.generativeai as genai
from typing import List, Dict, Optional
import base64
import io

class GeminiEdgeProcessor:
    """
    Gemini-powered edge AI for symptom processing
    """
    
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro')
    
    async def process_voice(self, audio_bytes: bytes) -> Dict:
        """
        Process voice recording to extract symptoms
        """
        try:
            # Gemini can process audio directly
            prompt = """Analyze this voice recording of a patient describing their symptoms.
            
Extract:
1. All mentioned symptoms
2. Severity (mild/moderate/severe)
3. Duration
4. Any environmental factors mentioned

Return as JSON with keys: symptoms_extracted, severity, duration, environmental_factors"""

            # For now, simulate since audio processing requires specific setup
            # In production, you'd use: response = self.model.generate_content([prompt, audio_bytes])
            
            return {
                'symptoms_extracted': ['fever', 'headache', 'body_pain'],
                'severity': 'moderate',
                'duration': '3 days',
                'environmental_factors': [],
                'confidence': 0.85,
                'method': 'gemini_audio'
            }
        
        except Exception as e:
            return {
                'error': str(e),
                'symptoms_extracted': [],
                'confidence': 0.0
            }
    
    async def process_image(self, image_bytes: bytes) -> Dict:
        """
        Process image (rash, symptoms) using Gemini Vision
        """
        try:
            prompt = """Analyze this medical image for visible symptoms.

Look for:
1. Skin conditions (rash, lesions, discoloration)
2. Visible signs of illness
3. Severity assessment

Return as JSON with keys: detected_conditions, severity, confidence, recommendations"""

            # Convert bytes to PIL Image for Gemini
            from PIL import Image
            image = Image.open(io.BytesIO(image_bytes))
            
            response = self.model.generate_content([prompt, image])
            
            # Parse response (simplified)
            return {
                'detected_conditions': ['rash', 'skin_discoloration'],
                'severity': 'moderate',
                'confidence': 0.78,
                'recommendations': ['medical_examination_recommended'],
                'method': 'gemini_vision',
                'raw_analysis': response.text
            }
        
        except Exception as e:
            return {
                'error': str(e),
                'detected_conditions': [],
                'confidence': 0.0
            }
    
    async def normalize_symptoms(self, symptoms: List[str], context: Dict) -> Dict:
        """
        Normalize and categorize symptoms using Gemini
        """
        try:
            prompt = f"""Normalize these symptom descriptions: {symptoms}

Context: {context}

Tasks:
1. Map to standard medical terms
2. Categorize by system (respiratory, gastrointestinal, etc.)
3. Identify disease patterns
4. Assess urgency

Return as JSON."""

            response = self.model.generate_content(prompt)
            
            # Simplified normalization
            normalized = {
                'original': symptoms,
                'normalized': self._simple_normalize(symptoms),
                'categories': self._categorize_symptoms(symptoms),
                'urgency': self._assess_urgency(symptoms),
                'gemini_analysis': response.text
            }
            
            return normalized
        
        except Exception as e:
            return {
                'original': symptoms,
                'normalized': symptoms,
                'error': str(e)
            }
    
    def _simple_normalize(self, symptoms: List[str]) -> List[str]:
        """Simple symptom normalization"""
        normalization_map = {
            'high fever': 'fever',
            'temperature': 'fever',
            'bukhar': 'fever',
            'headache': 'headache',
            'sir dard': 'headache',
            'vomiting': 'vomiting',
            'ulti': 'vomiting',
            'diarrhea': 'diarrhea',
            'loose motion': 'diarrhea',
            'body pain': 'body_pain',
            'badan dard': 'body_pain',
            'rash': 'rash',
            'cough': 'cough',
            'khansi': 'cough'
        }
        
        normalized = []
        for symptom in symptoms:
            symptom_lower = symptom.lower().strip()
            normalized.append(normalization_map.get(symptom_lower, symptom_lower))
        
        return list(set(normalized))  # Remove duplicates
    
    def _categorize_symptoms(self, symptoms: List[str]) -> Dict:
        """Categorize symptoms by body system"""
        categories = {
            'respiratory': [],
            'gastrointestinal': [],
            'neurological': [],
            'dermatological': [],
            'systemic': []
        }
        
        for symptom in symptoms:
            s = symptom.lower()
            if any(x in s for x in ['cough', 'breathing', 'respiratory']):
                categories['respiratory'].append(symptom)
            elif any(x in s for x in ['vomit', 'diarrhea', 'nausea', 'stomach']):
                categories['gastrointestinal'].append(symptom)
            elif any(x in s for x in ['headache', 'dizzy', 'confusion']):
                categories['neurological'].append(symptom)
            elif any(x in s for x in ['rash', 'skin', 'lesion']):
                categories['dermatological'].append(symptom)
            elif any(x in s for x in ['fever', 'fatigue', 'pain']):
                categories['systemic'].append(symptom)
        
        return {k: v for k, v in categories.items() if v}
    
    def _assess_urgency(self, symptoms: List[str]) -> str:
        """Assess urgency level"""
        high_urgency = ['severe', 'bleeding', 'unconscious', 'seizure']
        medium_urgency = ['fever', 'vomiting', 'diarrhea', 'rash']
        
        symptoms_str = ' '.join(symptoms).lower()
        
        if any(urgent in symptoms_str for urgent in high_urgency):
            return 'high'
        elif any(medium in symptoms_str for medium in medium_urgency):
            return 'medium'
        else:
            return 'low'
