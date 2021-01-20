import Head from "next/head";
import React from "react";
import type { graph, node, edge } from "shared";
import Async from "../components/Async";
import Graph from "../components/Graph";
import Errors from "../components/Errors";
import { fold, none, some, Option } from "fp-ts/option";
import { constant, pipe } from "fp-ts/function";



const Home = () => {
  let [graph, setGraph] = React.useState<Option<graph>>(none);

  let handleAsyncGraph = (graph: graph) => setGraph(some(graph));

  return (
    <div>
      <Head>
        <title>LN Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Async url="/graph" callback={handleAsyncGraph}>
        {
          pipe(
            graph,
            fold(
              constant(<Errors.Unknown />),
              (graph: graph) => <Graph graph={graph} />
            )
          )
        }
      </Async>
    </div>
  );
};

export default Home;
