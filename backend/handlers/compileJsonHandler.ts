const handleCompileJsonNode = (node: any) => {
  node.output = JSON.stringify(node.input, null, 2);
  return node;
};

export default handleCompileJsonNode;
