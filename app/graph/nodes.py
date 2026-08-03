from enum import Enum


class NodeType(Enum):
    FILE = "FILE"
    CLASS = "CLASS"
    FUNCTION = "FUNCTION"
    METHOD = "METHOD"


def create_node(
    node_id,
    node_type,
    name,
    metadata=None
):

    return {
        "id": node_id,
        "type": node_type,
        "name": name,
        "metadata": metadata or {}
    }