from fastapi import APIRouter

from backend.models.requests import AnalyzeRequest
from backend.models.responses import AnalyzeResponse

from backend.state import analysis_state

from app.chat.conversation_memory import clear_conversation_history
from app.ingestion.ingestion_pipeline import ingestion_pipeline
from app.repository.repository_pipeline import repository_pipeline
from app.repository.repository_graph_pipeline import (
    repository_graph_pipeline
)
from app.chunking.chunk_pipeline import (
    build_repository_chunks
)

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_repository(request: AnalyzeRequest):

    clear_conversation_history()

    ingestion_data = ingestion_pipeline(
        request.repo_url
    )

    repository_data = repository_pipeline(
        ingestion_data
    )

    repository_graph = repository_graph_pipeline(
        repository_data
    )

    chunk_data = build_repository_chunks(
        repository_path=ingestion_data["repo_path"],
        inventory=ingestion_data["inventory"]
    )

    analysis_state["ingestion_data"] = ingestion_data
    analysis_state["repository_data"] = repository_data
    analysis_state["repository_graph"] = repository_graph
    analysis_state["chunk_data"] = chunk_data

    return AnalyzeResponse(
        status="success",
        files=len(ingestion_data["inventory"]),
        chunks=len(chunk_data["chunks"]),
        graph_nodes=len(repository_graph["nodes"]),
        graph_edges=len(repository_graph["edges"])
    )