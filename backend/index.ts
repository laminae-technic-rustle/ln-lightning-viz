import express from "express";
import cors from "cors";
import compression from "compression";

import { initState } from "./state";

const port = process.env.NODE_PORT || 8080;
const app = express();
app.use(cors());
app.use(compression());

console.log("\n **** Initializing State **** \n");
const state = initState();

app.get("/graph", (req, res) => {
  return res.status(200).send(state.graph);
});

console.log("\n **** Starting Server **** \n");
// start the Express server
app.listen(port, () => {
  console.log(`**** Server started at http://localhost:${port} **** `);
});
