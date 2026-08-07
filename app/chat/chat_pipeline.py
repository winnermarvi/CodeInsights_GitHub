from app.chat.conversation_memory import (
    add_user_message,
    add_assistant_message
)

from app.rag.rag_pipeline import rag_pipeline


def chat_pipeline(question):

    add_user_message(question)

    answer = rag_pipeline(
        question=question
    )

    add_assistant_message(answer)

    return answer