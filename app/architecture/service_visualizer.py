from pyvis.network import Network


def visualize_service_graph(service_graph):

    net = Network(
        height="900px",
        width="100%",
        directed=True,
        bgcolor="#222222",
        font_color="white"
    )

    for service in service_graph["nodes"]:

        net.add_node(
            service,
            label=service,
            title=service,
            color="#4FC3F7"
        )

    for edge in service_graph["edges"]:

        net.add_edge(
            edge["source"],
            edge["target"],
            label="DEPENDS_ON"
        )

    net.repulsion(
        node_distance=300,
        spring_length=300
    )

    net.write_html(
        "data/graph/service_diagram.html",
        notebook=False
    )