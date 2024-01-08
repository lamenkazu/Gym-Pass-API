import { app } from "./app";

const port = 3333;
app
  .listen({
    host: "0.0.0.0",
    port: port,
  })
  .then(() => console.log(`🚀 Server Runing in ${port}`));
