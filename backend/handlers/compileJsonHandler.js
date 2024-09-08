const handleCompileJsonNode = (node) => {
  node.output = JSON.stringify(node.input, null, 2);
  return node;
};

module.exports = handleCompileJsonNode;
