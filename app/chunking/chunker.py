from tree_sitter import Node
from pathlib import Path


def build_chunks(tree, relative_path):

    relative_path = Path(relative_path)

    chunks = []

    def traverse(node):

        # ---------- Function Chunk ----------
        if node.type == "function_definition" and node.parent.type == "module":

            function_name = ""

            for child in node.children:

                if child.type == "identifier":
                    function_name = child.text.decode("utf-8")
                    break

            chunks.append({
                "type": "function",
                "name": function_name,
                "content": node.text.decode("utf-8"),
                "metadata": {
                    "file": relative_path.name,
                    "relative_path": str(relative_path)
                }
            })

        # ---------- Class Chunk ----------
        elif node.type == "class_definition":

            class_name = ""

            for child in node.children:

                if child.type == "identifier":
                    class_name = child.text.decode("utf-8")
                    break

            chunks.append({
                "type": "class",
                "name": class_name,
                "content": node.text.decode("utf-8"),
                "metadata": {
                    "file": relative_path.name,
                    "relative_path": str(relative_path)
                }
            })

        for child in node.children:
            traverse(child)

    traverse(tree.root_node)

    return chunks