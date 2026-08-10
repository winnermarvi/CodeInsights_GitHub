from app.search.search_pipeline import search_pipeline
from app.rag.prompt_builder import build_prompt
from app.rag.response_generator import generate_response
from app.chat.conversation_memory import get_conversation_history


def build_sources(retrieved_chunks):

    sources = []

    for chunk in retrieved_chunks:

        metadata = chunk.get("metadata", {})

        file_name = metadata.get(
            "file_path",
            metadata.get(
                "file",
                "Unknown File"
            )
        )

        start_line = metadata.get("start_line")
        end_line = metadata.get("end_line")

        if start_line is not None and end_line is not None:

            source = (
                f"- {file_name}:{start_line}-{end_line}"
            )

        else:

            source = f"- {file_name}"

        if source not in sources:
            sources.append(source)

    return "\n".join(sources)


def rag_pipeline(question):

    retrieved_chunks = search_pipeline(
        query=question
    )
    print("\nRETRIEVED CHUNKS:")
    print(len(retrieved_chunks))

    for chunk in retrieved_chunks:
        print(chunk["name"])

    conversation_history = get_conversation_history()

    system_prompt, user_prompt = build_prompt(
        question=question,
        retrieved_chunks=retrieved_chunks,
        conversation_history=conversation_history
    )

    answer = generate_response(
        system_prompt=system_prompt,
        user_prompt=user_prompt
    )

    sources = build_sources(
        retrieved_chunks
    )

    final_response = (
        f"{answer}\n\n"
        f"Sources:\n"
        f"{sources}"
    )

    return final_response