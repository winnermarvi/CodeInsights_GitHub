from app.embedding.generator import generate_chunk_embedding


def embedding_pipeline(chunks):

    all_chunks = chunks["chunks"]
    failed_chunks = []

    for chunk in all_chunks:

        try:

            embedding = generate_chunk_embedding(chunk)

            chunk["embedding"] = embedding

        except Exception as e:

            failed_chunks.append(
                {
                    "file": chunk["metadata"]["relative_path"],
                    "name": chunk["name"],
                    "error": str(e)
                }
            )   

    print("\nSAMPLE CHUNK:")
    print(chunk["name"])
    print(chunk["embedding"][:5])

    return {
        "chunks": all_chunks,
        "failed_chunks": failed_chunks
    }