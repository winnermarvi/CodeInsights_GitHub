from app.chat.conversation_memory import (
    add_user_message,
    add_assistant_message,
    get_conversation_history
)

add_user_message(
    "How does search_pipeline work?"
)

add_assistant_message(
    "search_pipeline generates embeddings and retrieves chunks."
)

print(get_conversation_history())