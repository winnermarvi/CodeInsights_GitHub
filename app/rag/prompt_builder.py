def build_prompt(question, retrieved_chunks, max_context_chars=12000):

    system_prompt = """You are an expert software engineering assistant.
        Answer ONLY using the repository context provided in the user message.
        If the answer cannot be determined from the context, respond exactly with:
        "I could not find enough information in the repository context."

        When you answer:
        - Cite the specific source(s) you used, e.g. "(Source 2, utils/parser.py:14-30)"
        - Be precise about file names, function names, and line numbers when relevant
        - Do not invent code, file names, or behavior not present in the context
        """

    context_sections = []
    total_chars = 0

    for i, chunk in enumerate(retrieved_chunks):
        metadata = chunk.get("metadata", {})
        file_name = metadata.get("file_path", metadata.get("file", "Unknown File"))
        start_line = metadata.get("start_line")
        end_line = metadata.get("end_line")

        location = (
            f"{file_name}:{start_line}-{end_line}"
            if start_line is not None and end_line is not None
            else file_name
        )
        
        section = (
            f"[Source {i + 1}]\n"
            f"File: {location}\n\n"
            f"{chunk['content'].strip()}"
        )

        if total_chars + len(section) > max_context_chars:
            break

        context_sections.append(section)
        total_chars += len(section)

    repository_context = "\n\n".join(context_sections)

    user_prompt = f"""========================
        REPOSITORY CONTEXT
        ========================
        {repository_context}

        ========================
        QUESTION
        ========================
        {question}

        ========================
        ANSWER
        ========================
        """
    return system_prompt, user_prompt