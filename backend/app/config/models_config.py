from typing import Dict, List
from pydantic import BaseModel

class ModelInfo(BaseModel):
    id: str
    name: str
    description: str

class ProviderConfig(BaseModel):
    id: str
    name: str
    description: str
    models: List[ModelInfo]
    api_key_required: bool = True

# Static configuration for AI model providers
PROVIDERS_CONFIG: Dict[str, ProviderConfig] = {
    "gemini": ProviderConfig(
        id="gemini",
        name="Google Gemini",
        description="Google's advanced AI models for natural conversations",
        models=[
            ModelInfo(
                id="gemini-2.5-flash",
                name="Gemini 2.5 Flash",
                description="Fast and efficient model for general conversations"
            )
        ]
    ),
    "openai": ProviderConfig(
        id="openai",
        name="OpenAI",
        description="Industry-leading AI models from OpenAI",
        models=[
            ModelInfo(
                id="gpt-5-mini",
                name="GPT-5 Mini",
                description="Fast and cost-effective model for everyday tasks"
            ),
            ModelInfo(
                id="gpt-5-nano",
                name="GPT-5 Nano",
                description="Advanced model with enhanced capabilities"
            ),
            ModelInfo(
                id="gpt-4o-mini",
                name="GPT-4o Mini",
                description="Flagship model with superior reasoning abilities"
            )
        ]
    ),
    "groq": ProviderConfig(
        id="groq",
        name="Groq",
        description="Ultra-fast inference with various open-source models",
        models=[
            ModelInfo(
                id="llama-3.3-70b-versatile",
                name="Llama 3.3 70B Versatile",
                description="Versatile large language model"
            ),
            ModelInfo(
                id="openai/gpt-oss-20b",
                name="GPT-OSS 20B",
                description="Mixture of experts model for complex tasks"
            ),
            ModelInfo(
                id="openai/gpt-oss-120b",
                name="GPT-OSS 120B",
                description="Fast and efficient open-source model"
            ),
            ModelInfo(
                id="qwen/qwen3-32b",
                name="Qwen 3.2 32B",
                description="Large versatile model for complex reasoning"
            ),
            ModelInfo(
                id="meta-llama/llama-4-maverick-17b-128e-instruct",
                name="Llama 4 Maverick 17B 128E Instruct",
                description="Google's open model fine-tuned for instruction following"
            ),
            ModelInfo(
                id='deepseek-r1-distill-llama-70b',
                name='DeepSeek R1 Distill Llama 70B',
                description='DeepSeek R1 Distill Llama 70B'
            )
        ]
    )
}

def get_all_providers() -> List[ProviderConfig]:
    """Get all available model providers"""
    return list(PROVIDERS_CONFIG.values())

def get_provider_models(provider_id: str) -> List[ModelInfo]:
    """Get models for a specific provider"""
    if provider_id in PROVIDERS_CONFIG:
        return PROVIDERS_CONFIG[provider_id].models
    return []
