def build_metadata(repo_url,repo_path,inventory,languages):

    total_files = 0
    total_directories = 0

    for item in inventory:

        if item['type'] == 'file' :

            total_files += 1

        elif item['type'] == 'directory' :

            total_directories += 1

        else :
            pass


    return {
        "repository_name": repo_url.rstrip('/').split('/')[-1],
        "repository_url": repo_url,
        "repository_path": repo_path.as_posix(),
        "total_files": total_files,
        "total_directories": total_directories,
        "languages": languages
    }