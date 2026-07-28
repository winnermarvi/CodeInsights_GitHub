import json
from app.database.connection import get_connection

def load_embeddings():

    loaded_embeddings = []

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT id, embedding FROM chunks")

    rows = cursor.fetchall()

    for row in rows:
        chunk_id, embedding_json = row

        # Parse JSON strings back to Python objects
        embedding = json.loads(embedding_json)

        loaded_embeddings.append({
            'id' : chunk_id,
            'embedding' : embedding
        })

    connection.close()

    return loaded_embeddings
