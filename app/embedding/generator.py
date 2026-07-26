from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("jinaai/jina-embeddings-v2-base-code")

def generate_embedding(chunk):
    """
    Generate an embedding for a single semantic chunk.
    """

    content = chunk['content']

    embedding = embedding_model.encode(content).tolist()

    return embedding