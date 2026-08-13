from pathlib import Path
from app.code_understanging.parser import parse_file
from app.code_understanging.extractor import extract_repository_structure


def repository_pipeline(ingestion_result):

    repo_path = ingestion_result["repo_path"]
    inventory = ingestion_result["inventory"]

    repository_data = []

    for item in inventory:

        if item["type"] != "file":
            continue

        if item["extension"] != ".py":
            continue

        full_path = Path(repo_path) / item["relative_path"]

        tree = parse_file(full_path)

        if tree is None:
            continue

        extracted_data = extract_repository_structure(tree)

        repository_data.append(
            {
                "file_name": item["relative_path"],
                "extracted_data": extracted_data
            }
        )

    return repository_data