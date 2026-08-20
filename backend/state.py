from app.database.connection import get_connection

analysis_state = {
    "ingestion_data": None,
    "repository_data": None,
    "repository_graph": None,
    "chunk_data": None
}

conversation_history = []


def reset_state():

    analysis_state["ingestion_data"] = None
    analysis_state["repository_data"] = None
    analysis_state["repository_graph"] = None
    analysis_state["chunk_data"] = None

    conversation_history.clear()

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM chunks")

    connection.commit()
    connection.close()