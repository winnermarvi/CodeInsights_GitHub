from fastapi import APIRouter

from backend.models.requests import ImpactRequest
from backend.models.responses import ImpactResponse

from backend.state import analysis_state

from app.impact.impact_analysis_pipeline import (
    impact_analysis_pipeline
)

router = APIRouter(
    prefix="/impact",
    tags=["Impact Analysis"]
)


@router.post(
    "",
    response_model=ImpactResponse
)
def analyze_impact(request: ImpactRequest):

    repository_graph = analysis_state[
        "repository_graph"
    ]

    result = impact_analysis_pipeline(
        graph=repository_graph,
        changed_function=request.function_name
    )

    return ImpactResponse(**result)