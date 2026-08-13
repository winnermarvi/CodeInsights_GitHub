from app.graph.builder import (
    create_graph,
    build_file_graph,
    build_file_lookup,
    process_imports,
    build_function_lookup,
    process_function_calls
)


def repository_graph_pipeline(repository_data):

    repository_graph = create_graph()

    file_ids = {}

    # PASS 1
    # Create all nodes first

    for file_data in repository_data:

        repository_graph, file_id = build_file_graph(
            graph=repository_graph,
            file_name=file_data["file_name"],
            extracted_data=file_data["extracted_data"]
        )

        file_ids[file_data["file_name"]] = file_id

    # PASS 2
    # Build global file lookup

    file_lookup = build_file_lookup(
        repository_graph
    )

    # PASS 3
    # Process imports

    for file_data in repository_data:

        process_imports(
            graph=repository_graph,
            source_file_id=file_ids[file_data["file_name"]],
            imports=file_data["extracted_data"]["imports"],
            file_lookup=file_lookup
        )

    # PASS 4
    # Process function calls

    function_lookup = build_function_lookup(
        repository_graph
    )

    for file_data in repository_data:

        process_function_calls(
            graph=repository_graph,
            extracted_data=file_data["extracted_data"],
            function_lookup=function_lookup
        )

    return repository_graph