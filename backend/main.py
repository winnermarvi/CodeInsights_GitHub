from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.state import reset_state
from backend.routes.analyze import router as analyze_router
from backend.routes.chat import router as chat_router
from backend.routes.impact import router as impact_router
from backend.routes.architecture import router as architecture_router

app = FastAPI(
    title="CodeInsight API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/reset")
def reset_application():

    reset_state()

    return {
        "status": "reset"
    }

app.include_router(analyze_router)
app.include_router(chat_router)
app.include_router(impact_router)
app.include_router(architecture_router)