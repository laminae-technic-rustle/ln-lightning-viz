import express from "express";
import cors from "cors";
import compression from "compression";
import type { edge } from "shared";

import { initState } from "./state";

const port = process.env.NODE_PORT || 8080;
const app = express();
app.use(cors());
app.use(compression());

console.log("\n **** Initializing State **** \n");
const state = initState();

app.get("/graph", (_, res) => {
  return res.status(200).send(state.graph);
});

app.get("/node/:id", (req, res) => {
  return res.status(200).send(state.nodes[req.params.id]);
});

app.get("/node/:id/edges", (req, res) => {
  return res.status(200).send(state.graph.edges.filter(([_, source, dest]:edge) => source == req.params.id || dest == req.params.id));
});

app.get("/edge/:id", (req, res) => {
  return res.status(200).send(state.edges[req.params.id]);
});

app.get("/graph-with-metadata", (_, res) => {
  return res.status(200).send({ graph: state.graph, metadata: state.metadata });
});

console.log("\n **** Starting Server **** \n");
// start the Express server
app.listen(port, () => {
  console.log(`**** Server started at http://localhost:${port} **** `);
});
