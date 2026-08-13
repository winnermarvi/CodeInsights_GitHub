from pydantic import BaseModel
from typing import List


class AnalyzeResponse(BaseModel):
    status: str
    files: int
    chunks: int
    graph_nodes: int
    graph_edges: int


class ChatResponse(BaseModel):
    answer: str


class ImpactResponse(BaseModel):
    changed_function: str
    found: bool
    dependencies: List[str]
    affected_files: List[str]
    risk_level: str


class ArchitectureResponse(BaseModel):
    folder_diagram: str
    dependency_diagram: str
    service_diagram: str