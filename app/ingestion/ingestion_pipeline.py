from app.ingestion.clone import clone_repository
from app.ingestion.scanner import scan_repository
from app.ingestion.language_detector import detect_language
from app.ingestion.metadata import build_metadata

def ingestion_pipeline(repo_url):

    repo_path = clone_repository(repo_url)

    inventory = scan_repository(repo_path)

    languages = detect_language(inventory)

    metadata = build_metadata(repo_url,repo_path,inventory,languages)

    return {
        "inventory": inventory,
        "languages": languages,
        "metadata": metadata,
    }