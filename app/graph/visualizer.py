from pyvis.network import Network


def visualize_dependency_graph(graph):

    net = Network(
        height="900px",
        width="100%",
        directed=True,
        bgcolor="#222222",
        font_color="white"
    )

    added_nodes = set()

    # Add only FILE nodes involved in IMPORTS relationships
    for edge in graph["edges"]:

        if edge["relationship"] != "IMPORTS":
            continue

        source_id = edge["source"]
        target_id = edge["target"]

        source_node = next(
            node for node in graph["nodes"]
            if node["id"] == source_id
        )

        target_node = next(
            node for node in graph["nodes"]
            if node["id"] == target_id
        )

        if source_id not in added_nodes:

            net.add_node(
                source_id,
                label=source_node["name"],
                color="#4FC3F7",
                title=source_node["name"]
            )

            added_nodes.add(source_id)

        if target_id not in added_nodes:

            net.add_node(
                target_id,
                label=target_node["name"],
                color="#81C784",
                title=target_node["name"]
            )

            added_nodes.add(target_id)

        net.add_edge(
            source_id,
            target_id,
            label="IMPORTS"
        )

    net.repulsion(
        node_distance=250,
        spring_length=250
    )

    net.write_html(
        "data/architecture/dependency_graph.html",
        notebook=False
    )