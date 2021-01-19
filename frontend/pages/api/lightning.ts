import type { NextApiRequest, NextApiResponse } from "next";
import type { apiResponse, node, edge } from "./types";

type response = apiResponse<{ nodes: Array<node>, edges: Array<edge> }>;

export default (_: NextApiRequest, res: NextApiResponse<response>) =>
  res.status(200).json({ data: { nodes: [], edges: [] } });
