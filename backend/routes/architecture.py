from fastapi import APIRouter

from backend.models.responses import (
    ArchitectureResponse
)

router = APIRouter(
    prefix="/architecture",
    tags=["Architecture"]
)


@router.get(
    "",
    response_model=ArchitectureResponse
)
def get_architecture():

    return ArchitectureResponse(
        folder_diagram="data/architecture/folder_diagram.txt",
        dependency_diagram="data/architecture/dependency_graph.html",
        service_diagram="data/architecture/service_diagram.html"
    )