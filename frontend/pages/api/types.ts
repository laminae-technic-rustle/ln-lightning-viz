type nodeId = string;
type alias = string;
type node = [nodeId, alias];

type edgeId = string;
type from = nodeId;
type to = nodeId;
type edge = [edgeId, from, to];


type apiResponse<A> = {data: A} | {error: string};

export type { apiResponse, node, edge };

