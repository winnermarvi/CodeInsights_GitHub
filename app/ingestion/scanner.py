from pathlib import Path

IGNORED_DIRECTORIES = {
    ".git",
    "__pycache__",
    "node_modules",
    "venv",
    ".venv",
    "build",
    "dist",
}

IGNORED_EXTENSIONS = {".pdf"}


def should_ignore(item, repository_path):

    relative_path = item.relative_to(repository_path)

    # Ignore if any directory in the path is in the ignored list
    for part in relative_path.parts:
        if part in IGNORED_DIRECTORIES:
            return True

    # Ignore unwanted file extensions
    if item.is_file() and item.suffix.lower() in IGNORED_EXTENSIONS:
        return True

    return False


def scan_repository(repository_path):
    
    inventory = []

    for item in repository_path.rglob("*"):

        if should_ignore(item, repository_path):
            continue

        is_directory = item.is_dir()

        inventory.append(
            {
                "relative_path": item.relative_to(repository_path).as_posix(),
                "name": item.name,
                "type": "directory" if is_directory else "file",
                "extension": "" if is_directory else item.suffix,
            }
        )

    return inventory