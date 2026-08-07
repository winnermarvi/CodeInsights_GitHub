import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


MODEL_NAME = "llama-3.3-70b-versatile"


client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_response(system_prompt, user_prompt):

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        temperature=0.1,
        max_completion_tokens=1024
    )

    answer = response.choices[0].message.content

    return answer