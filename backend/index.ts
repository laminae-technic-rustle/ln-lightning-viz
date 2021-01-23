import express from "express";
import cors from "cors";
import compression from "compression";

import { initState } from "./state";

const port = process.env.NODE_PORT || 8080;
const app = express();

app.use(cors());
app.use(compression());

console.log("\n **** Initializing State ****");
const state = initState();

app.get("/graph", (_, res) =>
  state.graph ? res.status(200).send(state.graph) : res.status(500)
);

app.get("/node/:id", (req, res) =>
  state.nodes && state.nodes[req.params.id]
    ? res.status(200).send(state.nodes[req.params.id])
    : res.status(state.nodes ? 404 : 500)
);

app.get("/node/:id/edges", (req, res) =>
  state.edgesByNodeId && state.edgesByNodeId[req.params.id]
    ? res.status(200).send(state.edgesByNodeId[req.params.id])
    : res.status(state.edgesByNodeId ? 404 : 500)
);

app.get("/graph-with-statistics", (_, res) =>
  state.graph && state.statistics
    ? res.status(200).send({ graph: state.graph, statistics: state.statistics })
    : res.status(500)
);

console.log("\n **** Starting Server **** \n");
app.listen(port, () =>
  console.log(`**** Server started: http://localhost:${port} ****`)
);
