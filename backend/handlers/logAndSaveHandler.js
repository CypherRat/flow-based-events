const fs = require("fs");

const handleLogAndSaveNode = (node) => {
  try {
    console.log("Compiled JSON:", node.input);

    const outputData =
      typeof node.input === "object"
        ? JSON.stringify(node.input, null, 2)
        : node.input;

    fs.writeFileSync("output.txt", outputData);

      node.output = "Saved to output.txt";
      node.output = outputData;
  } catch (error) {
    console.error("Error handling log and save:", error);
    node.output = "Failed to save to output.txt";
  }

  return node;
};

module.exports = handleLogAndSaveNode;
