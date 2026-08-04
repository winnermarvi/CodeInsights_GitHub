import json

"""
Not the part of main code
"""

def save_graph(graph, output_path):

    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(
            graph,
            file,
            indent=4
        )