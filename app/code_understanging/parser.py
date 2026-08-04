from pathlib import Path

from tree_sitter import Parser
from tree_sitter_language_pack import get_language

from app.ingestion.language_detector import EXTENSION_TO_LANGUAGE


def parse_file(file_path):
    
    file_path = Path(file_path)

    extension = file_path.suffix.lower()

    if extension not in EXTENSION_TO_LANGUAGE:
        raise ValueError(
            f"Unsupported file extension: {extension}"
        )

    language_name = EXTENSION_TO_LANGUAGE[extension].lower()

    source_code = file_path.read_text(encoding="utf-8")

    parser = Parser()

    parser.language = get_language(language_name)

    tree = parser.parse(source_code.encode("utf-8"))

    return tree