EXTENSION_TO_LANGUAGE = {
    ".py": "Python",
    ".java": "Java",
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".c": "C",
    ".h": "C",
    ".cpp": "C++",
    ".cc": "C++",
    ".cxx": "C++",
    ".hpp": "C++",
    ".cs": "C#",
    ".go": "Go",
    ".rs": "Rust",
    ".php": "PHP",
    ".rb": "Ruby",
    ".swift": "Swift",
    ".kt": "Kotlin",
    ".kts": "Kotlin",
    ".scala": "Scala",
    ".r": "R",
    ".m": "MATLAB",
    ".pl": "Perl",
    ".sh": "Shell",
    ".bash": "Shell",
    ".zsh": "Shell",
    ".lua": "Lua",
    ".dart": "Dart",
}

def detect_language(inventory):

    languages = set()

    for item in inventory:

        if item['extension'].lower() in EXTENSION_TO_LANGUAGE:

            languages.add(EXTENSION_TO_LANGUAGE[item['extension']])

    return sorted(list(languages))