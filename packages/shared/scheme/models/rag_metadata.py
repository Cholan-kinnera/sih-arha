from typing import List
from pydantic import BaseModel, Field


class RAGMetadata(BaseModel):
    """Metadata payload and text summary chunks for vector embedding generation and hybrid search indexing."""
    topic_keywords: List[str] = Field(default_factory=list, description="Subject keywords for vector hybrid search filtering")
    summary_chunks: List[str] = Field(default_factory=list, description="Pre-crafted, high-signal text summary chunks for indexing")
