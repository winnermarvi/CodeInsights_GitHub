from app.graph.edges import EdgeType


def find_function_node(graph, function_name):

    for node in graph["nodes"]:

        if (
            node["type"] in ["FUNCTION", "METHOD"]
            and node["name"] == function_name
        ):
            return node

    return None


def find_direct_dependencies(graph, function_id):

    dependencies = []

    for edge in graph["edges"]:

        if (
            edge["source"] == function_id
            and edge["relationship"] == EdgeType.CALLS.value
        ):
            dependencies.append(edge["target"])

    return dependencies


def get_function_names(graph, function_ids):

    names = []

    for node in graph["nodes"]:

        if node["id"] in function_ids:
            names.append(node["name"])

    return names

def get_nodes_by_ids(graph, node_ids):

    nodes = []

    for node in graph["nodes"]:

        if node["id"] in node_ids:
            nodes.append(node)

    return nodes

def get_affected_files(dependency_nodes):

    affected_files = set()

    for node in dependency_nodes:

        metadata = node.get("metadata", {})

        file_name = metadata.get("file")

        if file_name:
            affected_files.add(file_name)

    return sorted(list(affected_files))


def calculate_risk_level(dependency_count):

    if dependency_count <= 2:
        return "LOW"

    elif dependency_count <= 5:
        return "MEDIUM"

    return "HIGH"


def impact_analysis_pipeline(
    graph,
    changed_function
):

    function_node = find_function_node(
        graph,
        changed_function
    )

    if not function_node:

        return {
            "changed_function": changed_function,
            "found": False,
            "dependencies": [],
            "affected_files": [],
            "risk_level": "LOW"
        }

    dependency_ids = find_direct_dependencies(
        graph,
        function_node["id"]
    )

    dependency_names = get_function_names(
        graph,
        dependency_ids
    )

    dependency_nodes = get_nodes_by_ids(
        graph,
        dependency_ids
    )

    affected_files = get_affected_files(
        dependency_nodes
    )

    risk_level = calculate_risk_level(
        len(dependency_names)
    )

    return {
        "changed_function": changed_function,
        "found": True,
        "dependencies": dependency_names,
        "affected_files": affected_files,
        "risk_level": risk_level
    }