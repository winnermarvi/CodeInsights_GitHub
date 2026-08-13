from app.ingestion.ingestion_pipeline import ingestion_pipeline

from app.chunking.chunk_pipeline import build_repository_chunks

from app.embedding.embedding_pipeline import embedding_pipeline

from app.database.store import store_chunks
from app.database.loader import load_embeddings

from app.database.schema import create_schema
from app.database.connection import get_connection

from app.chat.chat_pipeline import chat_pipeline
from app.chat.conversation_memory import (
    get_conversation_history
)

from app.repository.repository_pipeline import (
    repository_pipeline
)

from app.repository.repository_graph_pipeline import (
    repository_graph_pipeline
)

from app.impact.impact_analysis_pipeline import (
    impact_analysis_pipeline
)

from app.architecture.architecture_pipeline import (
    architecture_pipeline
)

# --------------------------------------------------
# DATABASE SETUP
# --------------------------------------------------

create_schema()

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
SELECT name
FROM sqlite_master
WHERE type='table'
""")

print(cursor.fetchall())

conn.close()


# --------------------------------------------------
# CONFIG
# --------------------------------------------------

REPO_URL = "https://github.com/winnermarvi/CodeInsights_GitHub"


# --------------------------------------------------
# PHASE 1
# INGESTION
# --------------------------------------------------

ingestion_data = ingestion_pipeline(
    REPO_URL
)

repository_path = ingestion_data["repo_path"]
inventory = ingestion_data["inventory"]

print("\nTOTAL FILES:")
print(len(inventory))


# --------------------------------------------------
# PHASE 2
# CHUNKING
# --------------------------------------------------

chunk_data = build_repository_chunks(
    repository_path=repository_path,
    inventory=inventory
)

print("\nTOTAL CHUNKS:")
print(len(chunk_data["chunks"]))

print("\nFAILED FILES:")
print(chunk_data["failed_files"])


# --------------------------------------------------
# PHASE 3
# EMBEDDINGS
# --------------------------------------------------

embedded_data = embedding_pipeline(
    chunk_data
)

print("\nTOTAL EMBEDDED CHUNKS:")
print(len(embedded_data["chunks"]))

print("\nFAILED CHUNKS:")
print(embedded_data["failed_chunks"])


# --------------------------------------------------
# PHASE 4
# STORE EMBEDDINGS
# --------------------------------------------------

store_chunks(
    embedded_data["chunks"]
)

print("\nSTORED TO DATABASE")


# --------------------------------------------------
# PHASE 5
# LOAD EMBEDDINGS
# --------------------------------------------------

embeddings = load_embeddings()

print("\nTOTAL EMBEDDINGS IN DATABASE:")
print(len(embeddings))


# --------------------------------------------------
# PHASE 7
# REPOSITORY EXTRACTION
# --------------------------------------------------

repository_data = repository_pipeline(
    ingestion_result=ingestion_data
)

print("\nREPOSITORY FILES:")
print(len(repository_data))


# --------------------------------------------------
# PHASE 7
# KNOWLEDGE GRAPH
# --------------------------------------------------

repository_graph = repository_graph_pipeline(
    repository_data
)

architecture_result = architecture_pipeline(
    inventory=inventory,
    repository_graph=repository_graph
)

print("\nARCHITECTURE OUTPUTS:")

print(
    architecture_result["folder_diagram"]
)

print(
    architecture_result["dependency_diagram"]
)

print(
    architecture_result["service_diagram"]
)
# --------------------------------------------------
# PHASE 9
# IMPACT ANALYSIS
# --------------------------------------------------

impact_report = impact_analysis_pipeline(
    graph=repository_graph,
    changed_function="search_pipeline"
)

print("\nIMPACT REPORT:")
print(impact_report)


# --------------------------------------------------
# PHASE 8
# CHAT
# --------------------------------------------------

question = "How does search_pipeline work?"

response = chat_pipeline(
    question=question
)

print("\nQUESTION:")
print(question)

print("\nANSWER:")
print(response)


question = "What does it call next?"

response = chat_pipeline(
    question=question
)

print("\nQUESTION:")
print(question)

print("\nANSWER:")
print(response)


# --------------------------------------------------
# MEMORY CHECK
# --------------------------------------------------

print("\nCONVERSATION HISTORY:")
print(
    get_conversation_history()
)


from app.architecture.folder_diagram import (
    save_folder_diagram
)

folder_diagram = save_folder_diagram(
    inventory
)

print("\nFOLDER DIAGRAM:")
print(folder_diagram)