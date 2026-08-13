from app.architecture.folder_diagram import (
    save_folder_diagram
)

from app.architecture.service_discovery import (
    discover_services
)

from app.architecture.service_visualizer import (
    visualize_service_graph
)

from app.graph.visualizer import (
    visualize_dependency_graph
)


def architecture_pipeline(
    inventory,
    repository_graph
):

    save_folder_diagram(
        inventory=inventory
    )

    visualize_dependency_graph(
        repository_graph
    )


    service_graph = discover_services(
        repository_graph
    )

    visualize_service_graph(
        service_graph
    )

    return {
        "folder_diagram": "data//folder_diagram.txt",
        "dependency_diagram": "data/graph/dependency_graph.html",
        "service_diagram": "data/graph/service_diagram.html",
        "service_graph": service_graph
    }