from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("jinaai/jina-embeddings-v2-base-code")

def generate_chunk_embedding(chunk):
    """
    Generate an embedding for a single semantic chunk.
    """

    content = chunk['content']

    chunk_embedding = embedding_model.encode(content).tolist()

    return chunk_embedding

def generate_query_embedding(query):
    """
    Generate an embedding for a single semantic chunk.
    """

    content = query

    query_embedding = embedding_model.encode(content).tolist()

    return query_embedding