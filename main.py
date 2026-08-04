from app.code_understanging.parser import parse_file
from app.code_understanging.extractor import extract_repository_structure
from app.graph.graph_pipeline import graph_pipeline


file_path = r"C:\Users\winne\CodeInsights_GitHub\tests\auths.py"

tree = parse_file(file_path)

print("Tree:", tree)

if tree is None:
    raise ValueError(
        f"Parsing failed for {file_path}"
    )

extracted_data = extract_repository_structure(
    tree
)

print("===== EXTRACTED DATA =====")
print(extracted_data)

graph = graph_pipeline(
    file_name="test.py",
    extracted_data=extracted_data
)


print("\n===== GRAPH =====")
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
