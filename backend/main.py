from fastapi import FastAPI

from backend.routes.analyze import router as analyze_router
from backend.routes.chat import router as chat_router
from backend.routes.impact import router as impact_router
from backend.routes.architecture import router as architecture_router

app = FastAPI(
    title="CodeInsight API"
)

app.include_router(analyze_router)
app.include_router(chat_router)
app.include_router(impact_router)
app.include_router(architecture_router)