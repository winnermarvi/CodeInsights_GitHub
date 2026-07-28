import sqlite3
from pathlib import Path


DATABASE_DIR = Path("data/database")
DATABASE_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_PATH = DATABASE_DIR / "codeinsight.db"


def get_connection():

    connection = sqlite3.connect(DATABASE_PATH)

    return connection