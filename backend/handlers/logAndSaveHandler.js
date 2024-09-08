const fs = require("fs");

const handleLogAndSaveNode = (node) => {
  console.log("Compiled JSON:", node.input);
  fs.writeFileSync("output.txt", node.input);
  node.output = "Saved to output.txt";
  return node;
};

module.exports = handleLogAndSaveNode;
