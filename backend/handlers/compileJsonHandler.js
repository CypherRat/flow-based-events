const handleCompileJsonNode = (node) => {
  try {
    if (
      node.input &&
      typeof node.input === "object" &&
      !Array.isArray(node.input)
    ) {
      const seen = new WeakSet();
      const safeStringify = (value, replacer, space) => {
        return JSON.stringify(
          value,
          (key, val) => {
            if (typeof val === "object" && val !== null) {
              if (seen.has(val)) {
                return;
              }
              seen.add(val);
            }
            return replacer ? replacer(key, val) : val;
          },
          space
        );
      };

      node.output = safeStringify(node.input, null, 2);
    } else {
      node.output = "ERROR: Invalid JSON input. Expected a JSON object.";
    }
  } catch (error) {
    console.error("Error converting to JSON:", error);
    node.output = "ERROR: Invalid JSON input";
  }

  return node;
};

module.exports = handleCompileJsonNode;
