from app.embedding.generator import embedding_model
import numpy as np

import numpy as np


def cosine_similarity(a, b):
    a = np.asarray(a, dtype=np.float32)
    b = np.asarray(b, dtype=np.float32)

    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    similarity = np.dot(a, b) / (norm_a * norm_b)

    return float(similarity)



def similarity_score(query,embeddings):

    similarities = []

    query_embedding = embedding_model.encode(query).tolist()

    for embedding in embeddings:

        score = cosine_similarity(query_embedding,embedding['embedding'])

        similarities.append(
            {
                'id' : embedding['id'],
                'score' : score
            }
        )

    similarities.sort(key=lambda x: x["score"],reverse=True)

    return similarities