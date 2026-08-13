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

    print("\nGENERATING FOLDER DIAGRAM...")

    save_folder_diagram(
        inventory=inventory
    )

    print("FOLDER DIAGRAM GENERATED")

    print("\nGENERATING DEPENDENCY DIAGRAM...")

    visualize_dependency_graph(
        repository_graph
    )

    print("DEPENDENCY DIAGRAM GENERATED")

    print("\nDISCOVERING SERVICES...")

    service_graph = discover_services(
        repository_graph
    )

    print(
        f"SERVICES DISCOVERED: {len(service_graph['nodes'])}"
    )

    print("\nGENERATING SERVICE DIAGRAM...")

    visualize_service_graph(
        service_graph
    )

    print("SERVICE DIAGRAM GENERATED")

    return {
        "folder_diagram": "data/architecture/folder_diagram.txt",
        "dependency_diagram": "data/architecture/dependency_graph.html",
        "service_diagram": "data/architecture/service_diagram.html",
        "service_graph": service_graph
    }