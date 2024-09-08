import fs from "fs";

const handleLogAndSaveNode = (node: any) => {
  console.log("Compiled JSON:", node.input);
  fs.writeFileSync("output.txt", node.input);
  node.output = "Saved to output.txt";
  return node;
};

export default handleLogAndSaveNode;
