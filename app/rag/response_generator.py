import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


MODEL_NAME = "openai/gpt-oss-120b"


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
        reasoning_format="hidden",
        max_completion_tokens=3072
    )

    answer = response.choices[0].message.content

    return answer