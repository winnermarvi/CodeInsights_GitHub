
def get_service_name(file_path):

    if not file_path.startswith("app/"):
        return None

    parts = file_path.split("/")

    if len(parts) < 2:
        return None

    return parts[1]



def build_node_lookup(graph):

    lookup = {}

    for node in graph["nodes"]:

        lookup[node["id"]] = node

    return lookup



def discover_services(graph):

    node_lookup = build_node_lookup(graph)

    service_nodes = set()

    service_edges = set()

    for edge in graph["edges"]:

        if edge["relationship"] != "IMPORTS":
            continue

        source_node = node_lookup.get(
            edge["source"]
        )

        target_node = node_lookup.get(
            edge["target"]
        )

        if not source_node or not target_node:
            continue

        source_path = (
            source_node["metadata"]
            .get("path")
        )

        target_path = (
            target_node["metadata"]
            .get("path")
        )

        source_service = get_service_name(
            source_path
        )

        target_service = get_service_name(
            target_path
        )

        if not source_service or not target_service:
            continue

        service_nodes.add(source_service)
        service_nodes.add(target_service)

        if source_service != target_service:

            service_edges.add(
                (
                    source_service,
                    target_service
                )
            )

    return {
        "nodes": sorted(
            list(service_nodes)
        ),

        "edges": [
            {
                "source": source,
                "target": target
            }
            for source, target in sorted(service_edges)
        ]
    }