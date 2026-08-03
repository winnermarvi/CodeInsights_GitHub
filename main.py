from app.ingestion.ingestion_pipeline import ingestion_pipeline
from app.code_understanging.parser import parse_file
from app.code_understanging.extractor import extract_repository_structure
from app.graph.builder import build_file_graph,build_function_lookup,process_function_calls


#a = ingestion_pipeline("https://github.com/winnermarvi/resume/")

graph = {
    "nodes": [],
    "edges": []
}

tree = parse_file(
    r"C:\Users\winne\CodeInsights_GitHub\test.py"
)

extracted_data = extract_repository_structure(tree)

graph = build_file_graph(
    graph,
    "test.py",
    extracted_data
)

function_lookup = build_function_lookup(
    graph
)

graph = process_function_calls(
    graph=graph,
    extracted_data=extracted_data,
    function_lookup=function_lookup
)

print(graph)

# def print_tree(node, prefix="", is_last=True, is_root=True):
#     if is_root:
#         print(node.type)
#         child_prefix = ""
#     else:
#         connector = "└── " if is_last else "├── "
#         print(f"{prefix}{connector}{f"{node.type}({node.text.decode()})"}")
#         child_prefix = prefix + ("    " if is_last else "│   ")

#     # Iterate through all children
#     children = node.children
#     count = len(children)
#     for i, child in enumerate(children):
#         is_child_last = (i == count - 1)
#         print_tree(child, prefix=child_prefix, is_last=is_child_last, is_root=False)


# print_tree(b.root_node)
