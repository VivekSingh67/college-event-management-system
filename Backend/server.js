const http = require("http");
const app = require("./app");
const envConfig = require("./config/envConfig");

const server = http.createServer(app);

server.listen(envConfig.PORT, () => {
  console.log(`Server run on ${envConfig.PORT}`);
});
