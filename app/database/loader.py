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


def load_chunks_by_ids(similarities):

    ids = [id['id'] for id in similarities]
    retrieved_chunks = []

    if len(ids) == 0:

        return retrieved_chunks

    connection = get_connection()
    cursor = connection.cursor()

    placeholders = ",".join(["?"] * len(ids))

    query = f"SELECT * FROM chunks WHERE id IN ({placeholders})"

    cursor.execute(query, ids)
    rows = cursor.fetchall()

    for row in rows:

        chunk_id, chunk_type, name, content, embedding_json, metadata_json = row

        # Parse JSON strings back to Python objects
        embedding = json.loads(embedding_json) if embedding_json else []
        metadata = json.loads(metadata_json) if metadata_json else {}

        retrieved_chunks.append(
            {
                "id" : chunk_id,
                "type" : chunk_type,
                "name" : name,
                "content":content,
                "embedding" : embedding,
                "metadata": metadata
            }
        )

    connection.close()

    id_order = {}
    for i,_id in enumerate(ids):

        id_order[_id] = i

    retrieved_chunks.sort(
        key=lambda chunk: id_order[chunk["id"]]
    )

    return retrieved_chunks