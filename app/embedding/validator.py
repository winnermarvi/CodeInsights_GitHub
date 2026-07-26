def validate_embeddings(chunks):

    all_chunks = chunks["chunks"]

    total_chunks = len(all_chunks)
    valid_embeddings = 0
    invalid_embeddings = 0
    embedding_dimension = None

    for chunk in all_chunks:

        embedding = chunk.get("embedding")

        # Embedding must exist
        if embedding is None:
            invalid_embeddings += 1
            continue

        # Embedding must be a list
        if not isinstance(embedding, list):
            invalid_embeddings += 1
            continue

        # Embedding must not be empty
        if len(embedding) == 0:
            invalid_embeddings += 1
            continue

        # Save the expected dimension
        if embedding_dimension is None:
            embedding_dimension = len(embedding)

        # Every embedding should have the same dimension
        elif len(embedding) != embedding_dimension:
            invalid_embeddings += 1
            continue

        valid_embeddings += 1

    return {
        "valid": invalid_embeddings == 0,
        "total_chunks": total_chunks,
        "valid_embeddings": valid_embeddings,
        "invalid_embeddings": invalid_embeddings,
        "embedding_dimension": embedding_dimension
    }