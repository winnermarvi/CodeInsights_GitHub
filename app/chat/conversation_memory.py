conversation_history = []

def clear_conversation_history():
    conversation_history.clear()


def add_user_message(message):

    conversation_history.append(
        {
            "role": "user",
            "content": message
        }
    )


def add_assistant_message(message):

    conversation_history.append(
        {
            "role": "assistant",
            "content": message
        }
    )


def get_conversation_history():

    return conversation_history