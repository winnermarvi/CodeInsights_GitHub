from app.code_understanging.parser import parse_file
from app.chunking.chunker import build_chunks


def build_repository_chunks(repository_path, inventory):

    all_chunks = []
    failed_files = []

    for item in inventory:

        try:
        
            # Skip directories
            if item["type"] != "file":
                continue

            # Currently we only support Python
            if item["extension"] != ".py":
                continue

            file_path = repository_path / item["relative_path"]

            with open(file_path, "r", encoding="utf-8") as file:
                source_code = file.read()

            tree = parse_file(source_code)

            chunks = build_chunks(tree, item["relative_path"])

            all_chunks.extend(chunks)

        except Exception as e:

            failed_files.append({
                "file": item["relative_path"],
                "error": str(e)
            })


    return {
        "chunks": all_chunks,
        "failed_files": failed_files
    }