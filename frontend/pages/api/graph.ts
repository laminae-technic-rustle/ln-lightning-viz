import type { NextApiRequest, NextApiResponse } from "next";

type nodeId = string;
type alias = string;
type node = [nodeId, alias];

type edgeId = string;
type from = nodeId;
type to = nodeId;
type edge = [edgeId, from, to];

type response = { nodes: Array<node>, edges: Array<edge> };

export default (req: NextApiRequest, res: NextApiResponse<response>) => {

  res.status(200).json({ nodes: [], edges: [] });
};
