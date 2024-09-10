const fs = require("fs");
const path = require("path");

const loadHandlers = () => {
  const handlers = {};
  const handlersPath = path.join(__dirname, "../handlers");

  fs.readdirSync(handlersPath).forEach((file) => {
    if (file.endsWith("Handler.js")) {
      const handlerName = path.basename(file, ".js");
      handlers[handlerName] = require(path.join(handlersPath, file));
    }
  });

  return handlers;
};

module.exports = loadHandlers;
