from app.graph.builder import (
    create_graph,
    build_file_graph,
    build_file_lookup,
    process_imports,
    build_function_lookup,
    process_function_calls
)


def graph_pipeline(
    file_name,
    extracted_data
):

    graph = create_graph()

    graph, file_id = build_file_graph(
        graph=graph,
        file_name=file_name,
        extracted_data=extracted_data
    )

    file_lookup = build_file_lookup(
        graph
    )

    graph = process_imports(
        graph=graph,
        source_file_id=file_id,
        imports=extracted_data["imports"],
        file_lookup=file_lookup
    )

    function_lookup = build_function_lookup(
        graph
    )

    graph = process_function_calls(
        graph=graph,
        extracted_data=extracted_data,
        function_lookup=function_lookup
    )

    return graph