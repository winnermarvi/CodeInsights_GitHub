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



def compute_similarities(embedded_query,stored_embeddings,k=5):

    similarities = []

    for embedding in stored_embeddings:

        score = cosine_similarity(embedded_query,embedding['embedding'])

        similarities.append(
            {
                'id' : embedding['id'],
                'score' : score
            }
        )

    similarities.sort(key=lambda x: x["score"],reverse=True)

    return similarities[:k]