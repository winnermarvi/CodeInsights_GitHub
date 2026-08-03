from tree_sitter import Node


def extract_repository_structure(tree):

    imports = set()
    functions = []
    classes = []

    def extract_calls(node):

        calls = []

        def traverse_calls(current_node):

            if current_node.type == "call":

                function_node = current_node.child_by_field_name("function")

                if function_node and function_node.type == "identifier":

                    calls.append(
                        function_node.text.decode("utf-8")
                    )

            for child in current_node.children:
                traverse_calls(child)

        traverse_calls(node)

        return calls
    

    def traverse(node: Node):

        if node.type == "import_statement":

            for child in node.children:

                if child.type == "dotted_name":

                    imports.add(child.text.decode("utf-8"))

        elif node.type == "import_from_statement":

            for child in node.children:

                if child.type == "dotted_name":

                    imports.add(child.text.decode("utf-8"))

                    break

        elif node.type == "function_definition" and node.parent.type == "module":

            for child in node.children:

                if child.type == "identifier":

                    function_name = child.text.decode("utf-8")

                    calls = extract_calls(node)

                    functions.append({
                        "name": function_name,
                        "calls": calls
                    })

                    break

        elif node.type == "class_definition":

            methods = []

            for child in node.children:

                if child.type == "identifier":

                    class_name = child.text.decode("utf-8")

                elif child.type == "block":

                    for block_child in child.children:

                        if block_child.type == "function_definition":

                            for method_child in block_child.children:

                                if method_child.type == "identifier":

                                    method_name = method_child.text.decode("utf-8")

                                    calls = extract_calls(block_child)

                                    methods.append({
                                        "name": method_name,
                                        "calls": calls
                                    })

            classes.append({"name" :class_name, "methods" : methods })

        for child in node.children:
            traverse(child)

    traverse(tree.root_node)

    return {
        "imports": sorted(imports),
        "functions": functions,
        "classes" : classes,
        "metadata": {
            "total_imports": len(imports),
            "total_functions": len(functions),
            "total_classes": len(classes),
            "total_methods": sum(len(cls["methods"]) for cls in classes)
        }
    }