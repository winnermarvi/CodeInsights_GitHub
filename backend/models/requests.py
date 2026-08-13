from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    repo_url: str


class ChatRequest(BaseModel):
    question: str


class ImpactRequest(BaseModel):
    function_name: str