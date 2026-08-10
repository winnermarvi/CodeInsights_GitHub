from app.chat.conversation_memory import get_conversation_history
from app.rag.response_generator import generate_response


def rewrite_query(question):

    history = get_conversation_history()

    if len(history) == 0:
        return question

    conversation_text = ""

    for message in history:

        role = message["role"].upper()

        conversation_text += (
            f"{role}: {message['content']}\n"
        )

    system_prompt = """
        Rewrite follow-up questions into standalone questions.

        IMPORTANT:
        - Preserve exact function names.
        - Preserve exact class names.
        - Preserve exact file names.
        - Do not paraphrase technical identifiers.
        - Keep the rewritten question as short as possible.
        - Do not add explanations.
        - Output only the rewritten question.
        """

    user_prompt = f"""
        Conversation History:

        {conversation_text}

        Current Question:

        {question}

        Rewrite the current question as a standalone question.
        """

    rewritten_question = generate_response(
        system_prompt=system_prompt,
        user_prompt=user_prompt
    )

    return rewritten_question.strip()