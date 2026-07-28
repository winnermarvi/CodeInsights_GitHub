import json

from app.database.connection import get_connection


def create_schema():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS chunks(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            type TEXT NOT NULL,

            name TEXT NOT NULL,

            content TEXT NOT NULL,

            embedding TEXT NOT NULL,

            metadata TEXT NOT NULL

        );
        """
    )

    connection.commit()

    connection.close()


create_schema()