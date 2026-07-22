import os
import stat
from pathlib import Path
import shutil
from git import Repo, GitCommandError

PROJECT_ROOT = Path(__file__).resolve().parents[2]

REPOSITORY_DIR = PROJECT_ROOT / "data" / "repositories"
CURRENT_REPO_DIR = REPOSITORY_DIR / "current_repo"


def remove_readonly(func, path, *args):
    """Clear read-only permissions on Windows and retry removal."""
    os.chmod(path, stat.S_IWRITE)
    func(path)


def clone_repository(repo_url):

    REPOSITORY_DIR.mkdir(parents=True, exist_ok=True)

    if CURRENT_REPO_DIR.exists():
        # Pass the callback handler to bypass Windows read-only file locks
        shutil.rmtree(CURRENT_REPO_DIR, onerror=remove_readonly)

    try:
        Repo.clone_from(repo_url, CURRENT_REPO_DIR)
        return CURRENT_REPO_DIR.resolve()

    except GitCommandError as e:
        raise Exception(f"Failed to clone repository: {e}")

    except Exception as e:
        raise Exception(f"Unexpected error while cloning repository: {e}")


