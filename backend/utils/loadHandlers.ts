import fs from "fs";
import path from "path";

const loadHandlers = () => {
  const handlers: { [key: string]: any } = {};
  const handlersPath = path.join(__dirname, "../handlers");

  fs.readdirSync(handlersPath).forEach((file) => {
    if (file.endsWith("Handler.ts")) {
      const handlerName = path.basename(file, ".ts");
      handlers[handlerName] = require(path.join(handlersPath, file)).default;
    }
  });

  return handlers;
};

export default loadHandlers;
