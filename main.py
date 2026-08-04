from app.repository.repository_pipeline import repository_pipeline
from app.repository.repository_graph_pipeline import repository_graph_pipeline
from app.graph.exporter import save_graph
from app.graph.visualizer import visualize_graph


repo_url = "https://github.com/winnermarvi/CodeInsights_GitHub"

repository_data = repository_pipeline(repo_url)

repository_graph = repository_graph_pipeline(
    repository_data
)


save_graph(
    repository_graph,
    "repository_graph.json"
)

