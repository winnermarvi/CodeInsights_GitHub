from app.graph.nodes import create_node, NodeType
from app.graph.edges import create_edge, EdgeType

def create_graph():

    return {
        "nodes": [],
        "edges": []
    }


def process_imports(
    graph,
    source_file_id,
    imports,
    file_lookup
):

    for imported_module in imports:

        if imported_module in file_lookup:

            target_file_id = file_lookup[imported_module]

            graph["edges"].append(
                create_edge(
                    source=source_file_id,
                    relationship=EdgeType.IMPORTS.value,
                    target=target_file_id
                )
            )

    return graph


def build_file_lookup(graph):

    file_lookup = {}

    for node in graph["nodes"]:

        if node["type"] == "FILE":

            module_name = (
                node["name"]
                .replace("/", ".")
                .replace(".py", "")
            )

            file_lookup[module_name] = node["id"]

    return file_lookup


current_id = 1


def get_next_id():

    global current_id

    node_id = current_id
    current_id += 1

    return node_id


def build_file_graph(graph, file_name, extracted_data):

    file_id = get_next_id()

    add_file_node = create_node(
        node_id=file_id,
        node_type=NodeType.FILE.value,
        name=file_name,
        metadata={
            "path": file_name
        }
    )

    graph["nodes"].append(add_file_node)

    for cls in extracted_data["classes"]:

        class_id = get_next_id()

        class_node = create_node(
            node_id=class_id,
            node_type=NodeType.CLASS.value,
            name=cls["name"],
            metadata={
                "file": file_name
            }
        )
        graph["nodes"].append(class_node)

        graph["edges"].append(
            create_edge(
                source=file_id,
                relationship=EdgeType.CONTAINS.value,
                target=class_id
            )
        )

        for method in cls["methods"]:

            method_id = get_next_id()

            method_node = create_node(
                node_id=method_id,
                node_type=NodeType.METHOD.value,
                name=method["name"],
                metadata={
                    "file": file_name,
                    "class": cls["name"]
                }
            )

            graph["nodes"].append(method_node)

            graph["edges"].append(
                create_edge(
                    source=class_id,
                    relationship=EdgeType.HAS_METHOD.value,
                    target=method_id
                )
            )

    for function in extracted_data["functions"]:

        function_id = get_next_id()

        function_node = create_node(
            node_id=function_id,
            node_type=NodeType.FUNCTION.value,
            name=function["name"],
            metadata={
                "file": file_name
            }
        )

        graph["nodes"].append(function_node)

        graph["edges"].append(
            create_edge(
                source=file_id,
                relationship=EdgeType.CONTAINS.value,
                target=function_id
            )
        )

    return graph,file_id


def build_function_lookup(graph):

    function_lookup = {}

    for node in graph["nodes"]:

        if node["type"] in ["FUNCTION", "METHOD"]:

            function_lookup[node["name"]] = node["id"]

    return function_lookup


def process_function_calls(
    graph,
    extracted_data,
    function_lookup
):

    for function in extracted_data["functions"]:

        source_id = function_lookup.get(
            function["name"]
        )

        if not source_id:
            continue

        for called_function in function["calls"]:

            target_id = function_lookup.get(
                called_function
            )

            if target_id:

                graph["edges"].append(
                    create_edge(
                        source=source_id,
                        relationship=EdgeType.CALLS.value,
                        target=target_id
                    )
                )

    for cls in extracted_data["classes"]:

        for method in cls["methods"]:

            source_id = function_lookup.get(
                method["name"]
            )

            if not source_id:
                continue

            for called_function in method["calls"]:

                target_id = function_lookup.get(
                    called_function
                )

                if target_id:

                    graph["edges"].append(
                        create_edge(
                            source=source_id,
                            relationship=EdgeType.CALLS.value,
                            target=target_id
                        )
                    )
               

    return graph