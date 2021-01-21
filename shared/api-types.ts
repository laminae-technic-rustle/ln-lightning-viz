/* JSON */
type unixTimestamp = number;

type jsonNode = {
  last_update: unixTimestamp;
  pub_key: string;
  alias: string;
  addresses: { network: string; addr: string }[];
  color: string;
  features: {
    [key: number]: { name: string; is_required: boolean; is_known: boolean };
  };
};

type nodePolicy = {
  time_lock_delta: number;
  min_htlc: number;
  fee_base_msat: number;
  fee_rate_milli_msat: number;
  disabled: false;
  max_htlc_msat: number;
  last_update: unixTimestamp;
};
type jsonEdge = {
  channel_id: string;
  chan_point: string;
  last_update: unixTimestamp;
  node1_pub: string;
  node2_pub: string;
  capacity: number;
  node1_policy: nodePolicy;
  node2_policy: nodePolicy;
};

type jsonGraph = {
  nodes: jsonNode[];
  edges: jsonEdge[];
};

/* API */
type nodeId = string;
type alias = string;
type node = [nodeId, alias];

type edgeId = string;
type from = nodeId;
type to = nodeId;
type edge = [edgeId, from, to];

type graph = { nodes: node[]; edges: edge[] };

type metadata =
  {
    nodeConnections: { [key: string]: number },
    min: number,
    average: number,
    median: number,
    max: number,
  }

type graphAndMetaData = { graph: graph, metadata: metadata };

export type { nodePolicy, jsonNode, jsonEdge, jsonGraph, nodeId, edgeId, node, edge, graph, metadata, graphAndMetaData };
