from app.embedding.generator import generate_query_embedding
from app.database.loader import load_embeddings, load_chunks_by_ids
from app.search.similarity import compute_similarities

def search_pipeline(query,k=5):

    query_embedding = generate_query_embedding(query)

    repo_id_embeddings = load_embeddings()

    retrieved_ids = compute_similarities(
        embedded_query=query_embedding,
        stored_embeddings=repo_id_embeddings,
        k=k
    )

    retrieved_chunks = load_chunks_by_ids(
        similarities=retrieved_ids
    )

    return retrieved_chunks



