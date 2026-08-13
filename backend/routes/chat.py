from fastapi import APIRouter

from backend.models.requests import ChatRequest
from backend.models.responses import ChatResponse

from app.chat.chat_pipeline import chat_pipeline

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post(
    "",
    response_model=ChatResponse
)
def chat(request: ChatRequest):

    answer = chat_pipeline(
        question=request.question
    )

    return ChatResponse(
        answer=answer
    )