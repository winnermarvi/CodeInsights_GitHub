from app.ingestion.ingestion_pipeline import ingestion_pipeline
from app.code_understanging.parser import parse_file

a = ingestion_pipeline("https://github.com/winnermarvi/resume/")

b = parse_file(r"C:\Users\winne\CodeInsights_GitHub\test.py")

def print_tree(node, prefix="", is_last=True, is_root=True):
    if is_root:
        print(node.type)
        child_prefix = ""
    else:
        connector = "└── " if is_last else "├── "
        print(f"{prefix}{connector}{f"{node.type}({node.text.decode()})"}")
        child_prefix = prefix + ("    " if is_last else "│   ")

    # Iterate through all children
    children = node.children
    count = len(children)
    for i, child in enumerate(children):
        is_child_last = (i == count - 1)
        print_tree(child, prefix=child_prefix, is_last=is_child_last, is_root=False)


print_tree(b.root_node)
