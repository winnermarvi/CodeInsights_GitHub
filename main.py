from app.ingestion.ingestion_pipeline import ingestion_pipeline
from app.chunking.chunk_pipeline import build_repository_chunks
from app.embedding.embedding_pipeline import embedding_pipeline
from app.database.store import store_chunks
from app.database.loader import load_embeddings
from app.rag.rag_pipeline import rag_pipeline

from app.database.schema import create_schema

create_schema()
from app.database.connection import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
SELECT name
FROM sqlite_master
WHERE type='table'
""")

print(cursor.fetchall())

conn.close()

REPO_URL = "https://github.com/winnermarvi/CodeInsights_GitHub"

# Phase 1
ingestion_data = ingestion_pipeline(REPO_URL)

repository_path = ingestion_data["repo_path"]
inventory = ingestion_data["inventory"]

print("\nTOTAL FILES:")
print(len(inventory))

# Phase 2
chunk_data = build_repository_chunks(
    repository_path=repository_path,
    inventory=inventory
)

print("\nTOTAL CHUNKS:")
print(len(chunk_data["chunks"]))

print("\nFAILED FILES:")
print(chunk_data["failed_files"])

# Phase 3
embedded_data = embedding_pipeline(
    chunk_data
)

print("\nTOTAL EMBEDDED CHUNKS:")
print(len(embedded_data["chunks"]))

print("\nFAILED CHUNKS:")
print(embedded_data["failed_chunks"])

# Phase 4
store_chunks(
    embedded_data["chunks"]
)

print("\nSTORED TO DATABASE")

#Phase 5
embeddings = load_embeddings()

print("\nTOTAL EMBEDDINGS IN DATABASE:")
print(len(embeddings))

question = "How does search_pipeline work?"

# response = rag_pipeline(question)

from app.chat.chat_pipeline import chat_pipeline

response = chat_pipeline(
    question=question
)

print(response)

from app.chat.conversation_memory import (
    get_conversation_history
)

print(get_conversation_history())