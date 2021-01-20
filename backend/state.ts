import cliProgress from "cli-progress";
import worker from "worker_threads";

import type { jsonGraph, jsonNode, jsonEdge, graph, node, edge } from "shared";

const jGraph: jsonGraph = require("../lightning_graph.json");

type state = {
  graph: graph,
  nodes: { [key: string]: jsonNode },
  edges: { [key: string]: jsonEdge }
};

const progress = {
  node: new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic),
  edge: new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
};

const initState = (): state => {
  console.log("\n **** Started - Parsing Nodes **** \n");
  progress.node.start(jGraph.nodes.length - 1, 0);

  const nodeArray = jGraph.nodes.reduce((acc, jsonN: jsonNode, i) => {
    progress.node.update(i);
    return [...acc, [jsonN.pub_key, jsonN.alias]];
  }, []);

  progress.node.stop();
  console.log("\n **** Finished - Parsing Nodes **** \n");

  console.log("\n **** Started - Parsing Edges **** \n");
  progress.edge.start(jGraph.edges.length - 1, 0);

  const edgeArray = jGraph.edges.reduce((acc, jsonE: jsonEdge, i) => {
    progress.edge.update(i);
    return [...acc, [jsonE.channel_id, jsonE.node1_pub, jsonE.node2_pub]];
  }, []);

  progress.edge.stop();
  console.log("\n **** Finished - Parsing Edges **** \n");

  return {
    graph: { nodes: nodeArray, edges: edgeArray },
    nodes: {}, // TODO - Add this
    edges: {} // TODO - Add this
  };
};

export { initState };
