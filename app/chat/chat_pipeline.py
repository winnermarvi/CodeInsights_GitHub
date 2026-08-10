from app.chat.conversation_memory import (
    add_user_message,
    add_assistant_message
)
from app.chat.query_rewriter import rewrite_query

from app.rag.rag_pipeline import rag_pipeline


def chat_pipeline(question):

    add_user_message(question)

    rewritten_question = rewrite_query(question)

    print("\nORIGINAL QUESTION:")
    print(question)

    print("\nREWRITTEN QUESTION:")
    print(rewritten_question)

    answer = rag_pipeline(rewritten_question)

    add_assistant_message(answer)

    return answer