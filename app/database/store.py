import json

from app.database.connection import get_connection


def store_chunks(embedded_chunks):

    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM chunks")

    for chunk in embedded_chunks:

        cursor.execute(
            """
            INSERT INTO chunks (
                type,
                name,
                content,
                embedding,
                metadata
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                chunk["type"],
                chunk["name"],
                chunk["content"],
                json.dumps(chunk["embedding"]),
                json.dumps(chunk["metadata"])
            )
        )

    connection.commit()
    connection.close()