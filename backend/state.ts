const jGraph: jsonGraph = require("../lightning_graph.json");

import type {
  statistics,
  jsonGraph,
  jsonNode,
  jsonEdge,
  graph,
  node,
  edge,
} from "shared";

// TS complains I can't use type aliases for the key. Not sure why, that would
// make it a lot more clear...
type state = {
  graph: graph;
  statistics: statistics; // From shared
  nodes: { [key: string]: jsonNode }; // Key === nodeId
  edgesByNodeId: { [key: string]: jsonEdge[] }; // Key === nodeId
};

/*
 * Takes the list of all nodes coming from JSON and produces two values:
 * Nodes:
 * - A hashmap of the nodes where the node ID is the key
 * NodeArray:
 * - An array of [nodeId] from the node
 */
const parseNodes = (
  jsonNodes: jsonNode[]
): { nodes: { [key: string]: jsonNode }; nodeArray: node[] } => {
  const nodes: { [key: string]: jsonNode } = {};
  const nodeArray: node[] = [];

  for (const node of jsonNodes) {
    const { pub_key } = node;
    nodeArray.push([pub_key]);
    nodes[pub_key] = node;
  }

  return { nodes, nodeArray };
};

/*
 * Takes the list of all edges coming from JSON and produces two values:
 * edgesByNodeId:
 * - A hashmap of the edges, where the key is the nodeId
 * EdgeArray:
 * - An array of [from, to], both containing nodeId's
 * NodeConnectionCount:
 * - A hashmap of the connection counts, where the key is the nodeId
 *
 * All stuffed into one loop, so it's nice and quick given huge LN dumps
 */
const parseEdges = (
  jsonEdges: jsonEdge[]
): {
  edgesByNodeId: { [key: string]: jsonEdge[] };
  edgeArray: edge[];
  nodeConnectionCount: { [key: string]: number };
} => {
  const edgeArray: edge[] = [];
  const edgesByNodeId: { [key: string]: jsonEdge[] } = {};
  const nodeConnectionCount: { [key: string]: number } = {};

  for (const edge of jsonEdges) {
    const { node1_pub, node2_pub } = edge;

    // edgeArray
    edgeArray.push([node1_pub, node2_pub]);

    // edgesByNodeId
    const edgesByNodeFrom = edgesByNodeId[node1_pub];
    Array.isArray(edgesByNodeFrom)
      ? edgesByNodeId[node1_pub].push(edge)
      : (edgesByNodeId[node1_pub] = [edge]);

    const edgesByNodeTo = edgesByNodeId[node2_pub];
    Array.isArray(edgesByNodeTo)
      ? edgesByNodeId[node2_pub].push(edge)
      : (edgesByNodeId[node2_pub] = [edge]);

    // nodeConnectionCount
    const oldFrom = nodeConnectionCount[node1_pub];
    nodeConnectionCount[node1_pub] =
      typeof oldFrom === "undefined" ? 0 : oldFrom + 1;

    const oldTo = nodeConnectionCount[node2_pub];
    nodeConnectionCount[node2_pub] =
      typeof oldTo === "undefined" ? 0 : oldTo + 1;
  }

  return { edgesByNodeId, edgeArray, nodeConnectionCount };
};

/*
 * Takes the list connectionscount per node and produces the follwing statistics
 * min:
 * - Miniumum connections
 * max:
 * - Maxiumum connections
 * average:
 * - Average connections
 * median:
 * - Median connections
 */
const extractStatistics = (nodeConnections: {
  [key: string]: number;
}): {
  min: number;
  max: number;
  average: number;
  median: number;
} => {
  const numbersOnly = Object.values(nodeConnections).sort();
  const average =
    numbersOnly.reduce((acc, x) => x + acc, 0) / numbersOnly.length;
  const median = numbersOnly[Math.round(numbersOnly.length / 2)];
  const min = numbersOnly[0];
  const max = numbersOnly[numbersOnly.length - 1];

  return { min, max, average, median };
};

const initState = (): state => {
  console.log("\n **** Parsing Nodes ****");
  const { nodes, nodeArray } = parseNodes(jGraph.nodes);

  console.log("\n **** Parsing Edges ****");
  const { edgesByNodeId, edgeArray, nodeConnectionCount } = parseEdges(
    jGraph.edges
  );

  console.log("\n **** Extracting Statistics ****");
  const { min, max, average, median } = extractStatistics(nodeConnectionCount);

  return {
    graph: { nodes: nodeArray, edges: edgeArray },
    statistics: {
      nodeConnectionCount,
      min,
      max,
      average,
      median,
    },
    nodes,
    edgesByNodeId,
  };
};

export { initState };
