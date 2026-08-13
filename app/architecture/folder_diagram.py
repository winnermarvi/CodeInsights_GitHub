from pathlib import Path


def build_folder_tree(inventory):

    tree = {}

    for item in inventory:

        relative_path = item["relative_path"]

        parts = Path(relative_path).parts

        current = tree

        for part in parts:

            if part not in current:
                current[part] = {}

            current = current[part]

    return tree


def format_tree(tree, indent=""):

    lines = []

    items = sorted(tree.items())

    for name, children in items:

        lines.append(f"{indent}{name}")

        lines.extend(
            format_tree(
                children,
                indent + "│   "
            )
        )

    return lines


def generate_folder_diagram(inventory):

    tree = build_folder_tree(inventory)

    lines = format_tree(tree)

    return "\n".join(lines)


def save_folder_diagram(
    inventory,
    output_path="data/graph/folder_diagram.txt"
):

    diagram = generate_folder_diagram(
        inventory
    )

    with open(
        output_path,
        "w",
        encoding="utf-8"
    ) as file:

        file.write(diagram)

    return diagram