from typing import List
from pydantic import BaseModel, Field

from packages.shared.scheme.models.application import ApplicationSpec
from packages.shared.scheme.models.benefits import Benefit
from packages.shared.scheme.models.documents import DocumentSpec
from packages.shared.scheme.models.eligibility import EligibilityTree
from packages.shared.scheme.models.geographic_scope import GeographicScope
from packages.shared.scheme.models.metadata import SchemeMetadata
from packages.shared.scheme.models.rag_metadata import RAGMetadata
from packages.shared.scheme.models.scheme_identity import SchemeIdentity
from packages.shared.scheme.models.source import Source


class SchemeSpecification(BaseModel):
    """Canonical Scheme Specification Root Model representing the 9 schema sections."""
    scheme: SchemeIdentity = Field(..., description="Core identity and lifecycle metadata")
    metadata: SchemeMetadata = Field(..., description="Institutional metadata and policy background")
    geographic_scope: GeographicScope = Field(..., description="Geographic targeting constraints")
    sources: List[Source] = Field(default_factory=list, description="Authoritative source registry for citations")
    eligibility: EligibilityTree = Field(..., description="Declarative eligibility rule tree (AST)")
    documents: List[DocumentSpec] = Field(default_factory=list, description="Required document evidence specifications")
    benefits: List[Benefit] = Field(default_factory=list, description="Specification of scheme benefits")
    application: ApplicationSpec = Field(..., description="Application readiness channels and procedure")
    rag_metadata: RAGMetadata = Field(..., description="Vector retrieval indexing metadata and summary chunks")
