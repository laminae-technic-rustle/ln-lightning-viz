# Frontend 

## Intro
This tiny BE server acts as a 
[BFF](https://medium.com/zinklar-tech/backend-for-frontend-bff-pattern-5e8810779d9f) 
for the FE. It does some of the data-churning to make the LN-Graph a bit more 
managable in terms of size to push over the wire. The main way it does this is 
by encoding a graph as an array of nodes (`[nodeId]`) and an array of edges 
(`[fromNodeId, toNodeId]`). That's the smalles possible representation for the 
full graph. It drops the overal size from 41MB to about 1.25MB (see 
[Curl](#curl)). It also means the FE has less of a memory footprint overal.

The idea is that upon bootup it creates an in-memory state object that has all
the data it needs to give back to the FE.

## Routes
`/graph` -> returns the whole graph, nodes and edges only
`/node/:id` -> returns the node by id
`/node/:id/edges` -> returns the edges for a given node
`/graph-with-statistics` -> returns the whole graph and some statistics

## Curl
In the root of this folder run:
```
curl -H "Accept-Encoding: gzip" -w "@curl-format.txt" -o /dev/null -s "http://localhost:8080/graph"
```

## Next Steps
Things that are missing:
- Tests
- Proper error messages
- CRON job to fetch latest LN graph snapshot ever X time :fire:
