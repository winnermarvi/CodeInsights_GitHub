def build_prompt(question, retrieved_chunks, conversation_history, max_context_chars=12000):

    system_prompt = """You are CodeInsight AI, an expert software engineering assistant.

        Your task is to analyze the user query against the provided repository context and provide a clear, clean, and highly readable response.

        Core Guidelines:
        1. Grounding & Logic: Ground your answers in the provided repository context. You may make logical deductions about module interactions based on imports, function signatures, and code flow.
        2. Missing Context: If the context lacks sufficient information to answer the core question, briefly explain what specific logic, file, or module is missing before providing any available high-level details.

        Formatting Rules (STRICT):
        1. Bullet Lists Only: Structure all execution flows, code breakdowns, and technical explanations using bold section headers and clean bulleted or numbered lists.
        2. NO TABLES: Do NOT use Markdown tables under any circumstances. Present all step-by-step traces, comparisons, and function summaries using plain text lists.
        3. NO Citation Clutter: Do NOT insert inline source tags, bracketed citations, or line numbers (e.g., avoid "(Source 2, chat_service.py:15-30)" or "【Source 1】") inside sentences or lists. Refer to file names and function signatures naturally in prose (e.g., "`generate_chat_response()` in `chat_service.py`").
        4. Clean Output: Do NOT append trailing "Sources:" lists, disclaimers, system signatures, or generic footers at the end of your response. Start directly with the answer and end cleanly.
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

    history_sections = []

    for message in conversation_history:

        role = message["role"].upper()

        history_sections.append(
            f"{role}: {message['content']}"
        )

    conversation_context = "\n".join(
        history_sections
    )

    user_prompt = f"""========================
        REPOSITORY CONTEXT
        ========================
        {repository_context}

        ========================
        CONVERSATION HISTORY
        ========================
        {conversation_context}

        ========================
        QUESTION
        ========================
        {question}

        ========================
        ANSWER
        ========================
        """
    return system_prompt, user_prompt