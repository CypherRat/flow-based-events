const axios = require("axios");

const handleHttpRequestNode = async (node) => {
  try {
    const { inputs } = node.data;
    const response = await axios.get(inputs.url);
    node.output = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    node.output = "Failed to fetch data";
  }
  return node;
};

module.exports = handleHttpRequestNode;
