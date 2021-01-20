import Head from "next/head";
import React from "react";
import type { graphAndMetaData, node, edge } from "shared";
import Async from "../components/Async";
import Graph02 from "../components/Graph02";
import Errors from "../components/Errors";
import { fold, none, some, Option } from "fp-ts/option";
import { constant, pipe } from "fp-ts/function";



const Version02 = () => {
  let [graph, setGraph] = React.useState<Option<graphAndMetaData>>(none);
  let handleAsyncGraph = (graph: graphAndMetaData) => setGraph(some(graph));

  return (
    <div>
      <Head>
        <title>LN Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Async url="/graph-with-metadata" callback={handleAsyncGraph}>
        {
          pipe(
            graph,
            fold(
              constant(<Errors.Unknown />),
              (graphAndMetaData: graphAndMetaData) => {
                console.log(graphAndMetaData.metadata);
                return (
                  <Graph02 graphAndMetaData={graphAndMetaData}
                    min={graphAndMetaData.metadata.min}
                    max={graphAndMetaData.metadata.max} />
                )
              }
            )
          )
        }
      </Async>
    </div>
  );
};

export default Version02;
