import axios from "axios";

const handleHttpRequestNode = async (node: any) => {
  try {
    const response = await axios.get(node.data.url);
    node.output = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    node.output = "Failed to fetch data";
  }
  return node;
};

export default handleHttpRequestNode;
