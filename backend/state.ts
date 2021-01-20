import cliProgress from "cli-progress";
import worker from "worker_threads";

import type { metadata, jsonGraph, jsonNode, jsonEdge, graph, node, edge } from "shared";

const jGraph: jsonGraph = require("../lightning_graph.json");

type state = {
  graph: graph,
  metadata: metadata,
  nodes: { [key: string]: jsonNode },
  edges: { [key: string]: jsonEdge }
};

const progress = {
  node: new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic),
  edge: new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic),
  meta: new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
};

const initState = (): state => {
  console.log("\n **** Parsing Nodes ****");
  progress.node.start(jGraph.nodes.length - 1, 0);

  const nodes: { [key: string]: jsonNode } = {};
  const nodeArray: node[] = [];
  for (let i = 0; i < jGraph.nodes.length; i++) {
    progress.node.update(i);
    const node = jGraph.nodes[i];
    const { pub_key, alias } = node;
    nodeArray.push([pub_key, alias])
    nodes[pub_key] = node;
  };
  progress.node.stop();

  console.log("\n **** Started - Parsing Edges ****");
  progress.edge.start(jGraph.edges.length - 1, 0);

  const edges: { [key: string]: jsonEdge } = {}
  const edgeArray: edge[] = [];
  for (let i = 0; i < jGraph.edges.length; i++) {
    progress.edge.update(i);
    const edge = jGraph.edges[i];
    const { channel_id, node1_pub, node2_pub } = edge;
    edgeArray.push([channel_id, node1_pub, node2_pub])
    edges[channel_id] = edge;
  };
  progress.edge.stop();

  console.log("\n **** Started - Parsing Metadata ****");
  progress.meta.start(edgeArray.length - 1, 0);

  const nodeConnections: { [key: string]: number } = {};
  for (let i = 0; i < edgeArray.length; i++) {
    progress.meta.update(i);

    const from = edgeArray[i][1];
    const oldFrom = nodeConnections[from];
    nodeConnections[from] = typeof oldFrom === "undefined" ? 0 : oldFrom + 1;

    const to = edgeArray[i][2];
    const oldTo = nodeConnections[to];
    nodeConnections[to] = typeof oldTo === "undefined" ? 0 : oldTo + 1;
  };

  const numbersOnly = Object.values(nodeConnections).sort();
  const average = numbersOnly.reduce((acc, x) => x + acc, 0) / numbersOnly.length;
  const median = numbersOnly[Math.round(numbersOnly.length / 2)];
  const min = numbersOnly[0]
  const max = numbersOnly[numbersOnly.length - 1];

  progress.meta.stop();

  return {
    graph: { nodes: nodeArray, edges: edgeArray },
    metadata: {
      nodeConnections,
      min,
      max,
      average,
      median,
    },
    nodes,
    edges
  };
};

export { initState };
