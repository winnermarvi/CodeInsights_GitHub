from enum import Enum


class EdgeType(Enum):
    CONTAINS = "CONTAINS"
    HAS_METHOD = "HAS_METHOD"
    IMPORTS = "IMPORTS"
    CALLS = "CALLS"


def create_edge(source, relationship, target):

    return {
        "source": source,
        "relationship": relationship,
        "target": target
    }